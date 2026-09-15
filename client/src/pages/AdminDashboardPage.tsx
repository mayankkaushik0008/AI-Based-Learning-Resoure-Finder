import { useState, useEffect } from 'react';
import { Users, FolderKanban, Search, BookmarkCheck, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { adminService } from '../services/adminService';
import toast from 'react-hot-toast';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalProjects: number;
    totalSearches: number;
    totalSavedResources: number;
    totalRatings: number;
    recentUsers: number;
    recentProjects: number;
  };
  popularTopics: Array<{ topic: string; count: number }>;
  resourceTypes: Array<{ type: string; count: number }>;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error: any) {
      toast.error('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card p-12 text-center">
        <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to load statistics</h3>
        <button onClick={loadStats} className="btn btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  const overviewStats = [
    {
      label: 'Total Users',
      value: stats.overview.totalUsers,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      change: stats.overview.recentUsers,
      changeLabel: 'new this month',
    },
    {
      label: 'Total Projects',
      value: stats.overview.totalProjects,
      icon: FolderKanban,
      color: 'bg-green-100 text-green-600',
      change: stats.overview.recentProjects,
      changeLabel: 'new this month',
    },
    {
      label: 'Total Searches',
      value: stats.overview.totalSearches,
      icon: Search,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Saved Resources',
      value: stats.overview.totalSavedResources,
      icon: BookmarkCheck,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Total Ratings',
      value: stats.overview.totalRatings,
      icon: TrendingUp,
      color: 'bg-pink-100 text-pink-600',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and statistics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {overviewStats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              {stat.change !== undefined && (
                <p className="text-xs text-gray-500 mt-2">
                  +{stat.change} {stat.changeLabel}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Popular Topics */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Popular Topics</h2>
          </div>
          <div className="space-y-3">
            {stats.popularTopics.slice(0, 8).map((topic, index) => {
              const maxCount = stats.popularTopics[0]?.count || 1;
              const percentage = (topic.count / maxCount) * 100;

              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{topic.topic}</span>
                    <span className="text-sm text-gray-600">{topic.count} projects</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resource Types */}
        <div className="card p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-bold text-gray-900">Resource Distribution</h2>
          </div>
          <div className="space-y-3">
            {stats.resourceTypes.map((resourceType, index) => {
              const total = stats.resourceTypes.reduce((sum, r) => sum + r.count, 0);
              const percentage = total > 0 ? (resourceType.count / total) * 100 : 0;

              const colors = [
                'bg-red-500',
                'bg-blue-500',
                'bg-green-500',
                'bg-purple-500',
                'bg-yellow-500',
                'bg-pink-500',
                'bg-indigo-500',
                'bg-gray-500',
              ];

              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded ${colors[index % colors.length]}`} />
                    <span className="text-sm font-medium text-gray-700">{resourceType.type}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{resourceType.count}</span>
                    <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="card p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">System Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">API Status</p>
            <p className="text-lg font-bold text-green-600">Operational</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">Database</p>
            <p className="text-lg font-bold text-green-600">Connected</p>
          </div>

          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-sm font-medium text-gray-700">AI Service</p>
            <p className="text-lg font-bold text-blue-600">
              {process.env.DEMO_MODE === 'true' ? 'Demo Mode' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
