import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { projectService, Project } from '../services/projectService';
import { FolderKanban, BookmarkCheck, Search, TrendingUp, Plus, ArrowRight, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Stats {
  totalProjects: number;
  activeProjects: number;
  totalSavedResources: number;
  totalSearches: number;
  averageProgress: number;
}

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setProjects } = useProjectStore();
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0,
    activeProjects: 0,
    totalSavedResources: 0,
    totalSearches: 0,
    averageProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projectsRes, statsRes] = await Promise.all([
        projectService.getProjects(),
        projectService.getProjectStats(),
      ]);

      setProjects(projectsRes.data);
      setStats(statsRes.data);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  const statCards = [
    { label: 'Active Projects', value: stats.activeProjects, icon: FolderKanban, color: 'bg-blue-100 text-blue-600' },
    { label: 'Saved Resources', value: stats.totalSavedResources, icon: BookmarkCheck, color: 'bg-green-100 text-green-600' },
    { label: 'Resources Explored', value: stats.totalSearches, icon: Search, color: 'bg-purple-100 text-purple-600' },
    { label: 'Learning Progress', value: `${stats.averageProgress}%`, icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  const recentProjects = projects.slice(0, 3);

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name} 👋
        </h1>
        <p className="text-gray-600 mt-2">Welcome back to your learning dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Projects */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Current Projects</h2>
          <Link to="/dashboard/projects" className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-40 rounded-lg" />
            ))}
          </div>
        ) : recentProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentProjects.map((project: Project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/dashboard/projects`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{project.title}</h3>
                  <span className={`badge ${getStageColor(project.currentStage)}`}>
                    {project.currentStage}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                  </div>
                  <span>{project.progress}%</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-primary-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No projects yet</p>
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Create Your First Project</span>
            </button>
          </div>
        )}
      </div>

      {/* Recommended Resources */}
      <div className="card p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended For You</h2>
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {projects.length > 0
              ? 'Use AI Resource Finder to discover personalized learning materials'
              : 'Start a project to get personalized recommendations'}
          </p>
          {projects.length > 0 && (
            <button
              onClick={() => navigate('/dashboard/resource-finder')}
              className="btn btn-primary inline-flex items-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Find Resources</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
