import { useState, useEffect } from 'react';
import { useProjectStore } from '../store/projectStore';
import { projectService } from '../services/projectService';
import { learningService } from '../services/learningService';
import { Route, CheckCircle2, Circle, Sparkles, BookOpen, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  order: number;
  isCompleted: boolean;
  resources: string[];
}

interface LearningPath {
  id: string;
  projectId: string;
  title: string;
  description: string;
  items: LearningPathItem[];
}

const LearningPathPage = () => {
  const { projects, setProjects } = useProjectStore();
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadLearningPath(selectedProjectId);
    }
  }, [selectedProjectId]);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
      if (response.data.length > 0) {
        setSelectedProjectId(response.data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const loadLearningPath = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await learningService.getLearningPath(projectId);
      setLearningPath(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setLearningPath(null);
      } else {
        toast.error('Failed to load learning path');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedProjectId) {
      toast.error('Please select a project');
      return;
    }

    try {
      setGenerating(true);
      const response = await learningService.generateLearningPath(selectedProjectId);
      setLearningPath(response.data);
      toast.success('Learning path generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate learning path');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    try {
      await learningService.completeItem(itemId, !currentStatus);
      
      // Update local state
      if (learningPath) {
        setLearningPath({
          ...learningPath,
          items: learningPath.items.map((item) =>
            item.id === itemId ? { ...item, isCompleted: !currentStatus } : item
          ),
        });
      }

      toast.success(!currentStatus ? 'Step completed!' : 'Step marked as incomplete');
    } catch (error) {
      toast.error('Failed to update step');
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const completedCount = learningPath?.items.filter((item) => item.isCompleted).length || 0;
  const totalCount = learningPath?.items.length || 0;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Path</h1>
        <p className="text-gray-600">AI-generated step-by-step guide for your projects</p>
      </div>

      {/* Project Selection */}
      <div className="card p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Project</label>
        <select
          className="input"
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        >
          {projects.length === 0 && <option value="">No projects available</option>}
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      {/* Learning Path Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      ) : learningPath ? (
        <div>
          {/* Progress Overview */}
          <div className="card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">{learningPath.title}</h2>
                <p className="text-gray-600">{learningPath.description}</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">{progressPercentage}%</div>
                <div className="text-sm text-gray-600">
                  {completedCount} of {totalCount} completed
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Learning Steps */}
          <div className="space-y-4">
            {learningPath.items.map((item, index) => (
              <LearningPathItemCard
                key={item.id}
                item={item}
                index={index}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        </div>
      ) : selectedProject ? (
        <div className="card p-12 text-center">
          <Route className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Learning Path Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Generate an AI-powered learning path for "{selectedProject.title}"
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            {generating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Learning Path</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="card p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Project Selected</h3>
          <p className="text-gray-600">Select a project to view or generate a learning path</p>
        </div>
      )}
    </div>
  );
};

// Learning Path Item Card
interface LearningPathItemCardProps {
  item: LearningPathItem;
  index: number;
  onToggleComplete: (itemId: string, currentStatus: boolean) => void;
}

const LearningPathItemCard = ({ item, index, onToggleComplete }: LearningPathItemCardProps) => {
  return (
    <div
      className={`card p-6 transition-all ${
        item.isCompleted ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Step Number / Checkmark */}
        <div className="flex-shrink-0">
          <button
            onClick={() => onToggleComplete(item.id, item.isCompleted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              item.isCompleted
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-primary-100 hover:text-primary-600'
            }`}
          >
            {item.isCompleted ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium text-gray-500">Step {item.order}</span>
                {item.isCompleted && (
                  <span className="badge bg-green-100 text-green-700 text-xs">Completed</span>
                )}
              </div>
              <h3
                className={`text-lg font-bold mb-2 ${
                  item.isCompleted ? 'text-gray-600 line-through' : 'text-gray-900'
                }`}
              >
                {item.title}
              </h3>
            </div>
          </div>

          <p className={`text-sm mb-4 ${item.isCompleted ? 'text-gray-500' : 'text-gray-600'}`}>
            {item.description}
          </p>

          {!item.isCompleted && index === 0 && (
            <div className="flex items-center space-x-2 text-sm text-primary-600">
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium">Current Step</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningPathPage;
