import { useEffect, useState } from 'react';
import { BookmarkCheck, ExternalLink, Trash2, FolderOpen, Search, Filter } from 'lucide-react';
import { resourceService } from '../services/resourceService';
import { Resource } from '../types/resource.types';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ConfirmDialog from '../components/ConfirmDialog';

interface SavedResource {
  id: string;
  resourceId: string;
  projectId?: string;
  notes?: string;
  createdAt: string;
  resource: Resource;
  project?: {
    id: string;
    title: string;
  };
}

const SavedResourcesPage = () => {
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);
  const [filteredResources, setFilteredResources] = useState<SavedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<SavedResource | null>(null);

  useEffect(() => {
    loadSavedResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [savedResources, searchQuery, filterType]);

  const loadSavedResources = async () => {
    try {
      setLoading(true);
      const response = await resourceService.getSavedResources();
      setSavedResources(response.data);
    } catch (error: any) {
      toast.error('Failed to load saved resources');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...savedResources];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (sr) =>
          sr.resource.title.toLowerCase().includes(query) ||
          sr.resource.description.toLowerCase().includes(query) ||
          sr.resource.author?.toLowerCase().includes(query)
      );
    }

    // Type filter
    if (filterType !== 'ALL') {
      filtered = filtered.filter((sr) => sr.resource.type === filterType);
    }

    setFilteredResources(filtered);
  };

  const handleDelete = (savedResource: SavedResource) => {
    setResourceToDelete(savedResource);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDelete) return;

    try {
      await resourceService.unsaveResource(resourceToDelete.resourceId);
      setSavedResources((prev) => prev.filter((sr) => sr.id !== resourceToDelete.id));
      toast.success('Resource removed from saved');
    } catch (error: any) {
      toast.error('Failed to remove resource');
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      VIDEO: 'bg-red-100 text-red-700',
      ARTICLE: 'bg-blue-100 text-blue-700',
      TUTORIAL: 'bg-green-100 text-green-700',
      PAPER: 'bg-purple-100 text-purple-700',
      GITHUB: 'bg-gray-100 text-gray-700',
      DOCUMENTATION: 'bg-yellow-100 text-yellow-700',
      COURSE: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const resourceTypes = ['ALL', 'VIDEO', 'ARTICLE', 'TUTORIAL', 'PAPER', 'GITHUB', 'DOCUMENTATION', 'COURSE'];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Saved Resources</h1>
        <p className="text-gray-600">Your collection of bookmarked learning materials</p>
      </div>

      {/* Search and Filter */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search saved resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input w-48"
            >
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resource List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-40 rounded-xl" />
          ))}
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            {filteredResources.length} saved resource{filteredResources.length !== 1 ? 's' : ''}
          </div>

          {filteredResources.map((savedResource) => (
            <div key={savedResource.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                {/* Thumbnail */}
                {savedResource.resource.thumbnail && (
                  <div className="flex-shrink-0">
                    <img
                      src={savedResource.resource.thumbnail}
                      alt={savedResource.resource.title}
                      className="w-40 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`badge ${getTypeColor(savedResource.resource.type)}`}>
                          {savedResource.resource.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {savedResource.resource.source}
                        </span>
                        {savedResource.project && (
                          <span className="badge bg-blue-100 text-blue-700 flex items-center space-x-1">
                            <FolderOpen className="w-3 h-3" />
                            <span>{savedResource.project.title}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {savedResource.resource.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {savedResource.resource.description}
                      </p>

                      {savedResource.resource.author && (
                        <p className="text-xs text-gray-500 mb-2">
                          By {savedResource.resource.author}
                        </p>
                      )}

                      {savedResource.notes && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span> {savedResource.notes}
                          </p>
                        </div>
                      )}

                      {savedResource.resource.topics.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {savedResource.resource.topics.slice(0, 5).map((topic, i) => (
                            <span key={i} className="badge bg-gray-100 text-gray-600 text-xs">
                              {topic}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                    <div className="text-xs text-gray-500">
                      Saved {formatDistanceToNow(new Date(savedResource.createdAt), { addSuffix: true })}
                    </div>

                    <div className="flex items-center space-x-3">
                      <a
                        href={savedResource.resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Open</span>
                      </a>

                      <button
                        onClick={() => handleDelete(savedResource)}
                        className="btn bg-red-50 text-red-600 hover:bg-red-100 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchQuery || filterType !== 'ALL' ? 'No resources found' : 'No saved resources yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || filterType !== 'ALL'
              ? 'Try adjusting your search or filters'
              : 'Start discovering and saving resources from the AI Resource Finder'}
          </p>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Remove Resource"
        message={`Are you sure you want to remove "${resourceToDelete?.resource.title}" from your saved resources?`}
        confirmText="Remove"
        variant="danger"
      />
    </div>
  );
};

export default SavedResourcesPage;
