import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Trash2, Edit, Sparkles, Calendar, Clock } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { projectService, Project, CreateProjectData } from '../services/projectService';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

const ProjectsPage = () => {
  const { projects, setProjects, addProject, updateProject, removeProject } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProjects();
      setProjects(response.data);
    } catch (error: any) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsCreateModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;

    try {
      await projectService.deleteProject(selectedProject.id);
      removeProject(selectedProject.id);
      toast.success('Project deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete project');
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.domain.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = filterStage === 'ALL' || project.currentStage === filterStage;

    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      IDEA: 'bg-gray-100 text-gray-700',
      RESEARCH: 'bg-blue-100 text-blue-700',
      LEARNING: 'bg-purple-100 text-purple-700',
      DEVELOPMENT: 'bg-green-100 text-green-700',
      TESTING: 'bg-yellow-100 text-yellow-700',
      DOCUMENTATION: 'bg-orange-100 text-orange-700',
      PRESENTATION: 'bg-pink-100 text-pink-700',
    };
    return colors[stage] || colors.IDEA;
  };

  const stages = ['ALL', 'IDEA', 'RESEARCH', 'LEARNING', 'DEVELOPMENT', 'TESTING', 'DOCUMENTATION', 'PRESENTATION'];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-2">Manage your learning projects and track progress</p>
        </div>
        <button onClick={handleCreateProject} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="input w-48"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage === 'ALL' ? 'All Stages' : stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="skeleton h-64 rounded-xl" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
              getStageColor={getStageColor}
            />
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterStage !== 'ALL' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterStage !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Create your first project to start your learning journey'}
          </p>
          {!searchQuery && filterStage === 'ALL' && (
            <button onClick={handleCreateProject} className="btn btn-primary inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      )}

      {/* Create Modal */}
      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={(project) => {
          addProject(project);
          setIsCreateModalOpen(false);
        }}
      />

      {/* Edit Modal */}
      {selectedProject && (
        <ProjectFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          project={selectedProject}
          onSuccess={(project) => {
            updateProject(project.id, project);
            setIsEditModalOpen(false);
          }}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  getStageColor: (stage: string) => string;
}

const ProjectCard = ({ project, onEdit, onDelete, getStageColor }: ProjectCardProps) => {
  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{project.title}</h3>
        <span className={`badge ${getStageColor(project.currentStage)} text-xs`}>
          {project.currentStage}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium w-20">Domain:</span>
          <span>{project.domain}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span className="font-medium w-20">Type:</span>
          <span>{project.projectType}</span>
        </div>
        {project.deadline && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{format(new Date(project.deadline), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      {project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {project.technologies.slice(0, 3).map((tech, index) => (
            <span key={index} className="badge bg-gray-100 text-gray-600 text-xs">
              {tech}
            </span>
          ))}
          {project.technologies.length > 3 && (
            <span className="badge bg-gray-100 text-gray-600 text-xs">
              +{project.technologies.length - 3}
            </span>
          )}
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="w-3 h-3 mr-1" />
          <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(project)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Edit project"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(project)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete project"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Project Form Modal Component
interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSuccess: (project: Project) => void;
}

const ProjectFormModal = ({ isOpen, onClose, project, onSuccess }: ProjectFormModalProps) => {
  const [formData, setFormData] = useState<CreateProjectData>({
    title: project?.title || '',
    description: project?.description || '',
    domain: project?.domain || '',
    technologies: project?.technologies || [],
    skillLevel: project?.skillLevel || 'BEGINNER',
    projectType: project?.projectType || 'PERSONAL',
    currentStage: project?.currentStage || 'IDEA',
    goals: project?.goals || '',
    deadline: project?.deadline ? project.deadline.split('T')[0] : '',
  });
  const [techInput, setTechInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = project
        ? await projectService.updateProject(project.id, formData)
        : await projectService.createProject(formData);

      toast.success(project ? 'Project updated successfully' : 'Project created successfully');
      onSuccess(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()],
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((t) => t !== tech),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? 'Edit Project' : 'Create New Project'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g., AI Chatbot with NLP"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            required
            rows={4}
            className="input"
            placeholder="Describe your project in detail..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain *</label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g., Web Development"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <select
              className="input"
              value={formData.projectType}
              onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            >
              <option value="PERSONAL">Personal</option>
              <option value="ACADEMIC">Academic</option>
              <option value="FINAL_YEAR">Final Year Project</option>
              <option value="RESEARCH">Research</option>
              <option value="HACKATHON">Hackathon</option>
              <option value="COMPETITION">Competition</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="Add technology (e.g., React)"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            />
            <button
              type="button"
              onClick={addTechnology}
              className="btn btn-secondary"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.technologies.map((tech, index) => (
              <span key={index} className="badge bg-primary-100 text-primary-700 flex items-center space-x-1">
                <span>{tech}</span>
                <button
                  type="button"
                  onClick={() => removeTechnology(tech)}
                  className="hover:text-primary-900"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
            <select
              className="input"
              value={formData.skillLevel}
              onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Stage</label>
            <select
              className="input"
              value={formData.currentStage}
              onChange={(e) => setFormData({ ...formData, currentStage: e.target.value })}
            >
              <option value="IDEA">Idea / Brainstorming</option>
              <option value="RESEARCH">Research</option>
              <option value="LEARNING">Learning / Skill Building</option>
              <option value="DEVELOPMENT">Development</option>
              <option value="TESTING">Testing</option>
              <option value="DOCUMENTATION">Documentation</option>
              <option value="PRESENTATION">Presentation</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Learning Goals</label>
          <textarea
            rows={3}
            className="input"
            placeholder="What do you want to learn from this project?"
            value={formData.goals}
            onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Deadline (Optional)</label>
          <input
            type="date"
            className="input"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="flex-1 btn btn-primary flex items-center justify-center space-x-2">
            {loading ? (
              <span>Saving...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{project ? 'Update Project' : 'Create Project'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectsPage;
