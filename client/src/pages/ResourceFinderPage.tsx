import { useState, useEffect } from 'react';
import { Sparkles, Search, SlidersHorizontal, ExternalLink, Star, BookmarkPlus, BookmarkCheck, ThumbsUp, Info } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { projectService } from '../services/projectService';
import { resourceService } from '../services/resourceService';
import { Resource, SearchFilters } from '../types/resource.types';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

const ResourceFinderPage = () => {
  const { projects, setProjects } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [customQuery, setCustomQuery] = useState('');
  const [stage, setStage] = useState('');
  const [skillLevel, setSkillLevel] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  const [savedResourceIds, setSavedResourceIds] = useState<Set<string>>(new Set());
  
  // Filters
  const [filters, setFilters] = useState<SearchFilters>({
    types: [],
    difficulty: '',
  });
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'popularity' | 'credibility'>('relevance');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  useEffect(() => {
    loadProjects();
    loadSavedResources();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [resources, filters, sortBy, selectedType]);

  const loadProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const loadSavedResources = async () => {
    try {
      const response = await resourceService.getSavedResources();
      const ids = new Set<string>(response.data.map((sr: { resourceId: string }) => sr.resourceId));
      setSavedResourceIds(ids);
    } catch (error) {
      console.error('Failed to load saved resources');
    }
  };

  const handleSearch = async () => {
    if (!selectedProject && !customQuery.trim()) {
      toast.error('Please select a project or enter a custom search query');
      return;
    }

    setLoading(true);
    setSearchComplete(false);

    try {
      const response = await resourceService.searchResources({
        projectId: selectedProject || undefined,
        customQuery: customQuery.trim() || undefined,
        stage,
        skillLevel,
        filters,
      });

      setResources(response.data.resources);
      setSearchComplete(true);
      toast.success(`Found ${response.data.resources.length} resources!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...resources];

    // Type filter
    if (selectedType !== 'ALL') {
      filtered = filtered.filter(r => r.type === selectedType);
    }

    // Difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(r => !r.difficulty || r.difficulty === filters.difficulty);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.overallScore || 0) - (a.overallScore || 0);
        case 'date':
          if (!a.publishedDate) return 1;
          if (!b.publishedDate) return -1;
          return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        case 'popularity':
          return (b.popularityScore || 0) - (a.popularityScore || 0);
        case 'credibility':
          return (b.credibilityScore || 0) - (a.credibilityScore || 0);
        default:
          return 0;
      }
    });

    setFilteredResources(filtered);
  };

  const handleSaveResource = async (resource: Resource) => {
    if (!resource.id) {
      toast.error('Cannot save this resource');
      return;
    }

    try {
      if (savedResourceIds.has(resource.id)) {
        await resourceService.unsaveResource(resource.id);
        setSavedResourceIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(resource.id!);
          return newSet;
        });
        toast.success('Resource removed from saved');
      } else {
        await resourceService.saveResource({
          resourceId: resource.id,
          projectId: selectedProject || undefined,
        });
        setSavedResourceIds(prev => new Set(prev).add(resource.id!));
        toast.success('Resource saved!');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save resource');
    }
  };

  const resourceTypes = ['ALL', 'VIDEO', 'ARTICLE', 'TUTORIAL', 'PAPER', 'GITHUB', 'DOCUMENTATION', 'COURSE'];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Resource Finder</h1>
        <p className="text-gray-600">Discover high-quality learning resources powered by AI</p>
      </div>

      {/* Search Form */}
      <div className="card p-6 mb-6">
        <div className="space-y-4">
          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Project (Optional)
            </label>
            <select
              className="input"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">-- No project selected --</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>

          {/* Custom Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Or Enter Custom Search Query
            </label>
            <input
              type="text"
              className="input"
              placeholder="e.g., React hooks tutorial, Machine learning basics..."
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              disabled={!!selectedProject}
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stage (Optional)
              </label>
              <select className="input" value={stage} onChange={(e) => setStage(e.target.value)}>
                <option value="">Auto-detect from project</option>
                <option value="IDEA">Idea / Brainstorming</option>
                <option value="RESEARCH">Research</option>
                <option value="LEARNING">Learning</option>
                <option value="DEVELOPMENT">Development</option>
                <option value="TESTING">Testing</option>
                <option value="DOCUMENTATION">Documentation</option>
                <option value="PRESENTATION">Presentation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level (Optional)
              </label>
              <select className="input" value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)}>
                <option value="">Auto-detect from project</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Searching with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find Resources with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {searchComplete && (
        <>
          {/* Filters Bar */}
          <div className="card p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">
                  {filteredResources.length} resources found
                </span>
                <div className="flex space-x-2 overflow-x-auto">
                  {resourceTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                        selectedType === type
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  className="input text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="relevance">Best Match</option>
                  <option value="date">Newest</option>
                  <option value="popularity">Most Popular</option>
                  <option value="credibility">Highest Rated</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Filters</span>
                </button>
              </div>
            </div>

            {/* Extended Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Difficulty
                    </label>
                    <select
                      className="input"
                      value={filters.difficulty}
                      onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    >
                      <option value="">All Levels</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Resource Grid */}
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredResources.map((resource, index) => (
                <ResourceCard
                  key={`${resource.url}-${index}`}
                  resource={resource}
                  isSaved={!!resource.id && savedResourceIds.has(resource.id)}
                  onSave={handleSaveResource}
                />
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources found</h3>
              <p className="text-gray-600">Try adjusting your filters or search query</p>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!searchComplete && !loading && (
        <div className="card p-12 text-center">
          <Sparkles className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Ready to discover amazing learning resources?
          </h3>
          <p className="text-gray-600 mb-6">
            Select a project or enter a search query to get started with AI-powered resource discovery
          </p>
        </div>
      )}
    </div>
  );
};

// Resource Card Component
interface ResourceCardProps {
  resource: Resource;
  isSaved: boolean;
  onSave: (resource: Resource) => void;
}

const ResourceCard = ({ resource, isSaved, onSave }: ResourceCardProps) => {
  const [showExplanation, setShowExplanation] = useState(false);

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

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      YOUTUBE: 'text-red-600',
      GITHUB: 'text-gray-900',
      OPENALEX: 'text-blue-600',
      WEB: 'text-green-600',
    };
    return colors[source] || 'text-gray-600';
  };

  const matchScore = Math.round((resource.overallScore || 0) * 100);

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Thumbnail */}
        {resource.thumbnail && (
          <div className="flex-shrink-0">
            <img
              src={resource.thumbnail}
              alt={resource.title}
              className="w-40 h-24 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className={`badge ${getTypeColor(resource.type)}`}>
                  {resource.type}
                </span>
                <span className={`text-sm font-medium ${getSourceColor(resource.source)}`}>
                  {resource.source}
                </span>
                {resource.difficulty && (
                  <span className="badge bg-gray-100 text-gray-600 text-xs">
                    {resource.difficulty}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                {resource.title}
              </h3>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {resource.description}
              </p>

              {resource.author && (
                <p className="text-xs text-gray-500 mb-2">
                  By {resource.author}
                  {resource.publishedDate && (
                    <span className="ml-2">
                      • {formatDistanceToNow(new Date(resource.publishedDate), { addSuffix: true })}
                    </span>
                  )}
                </p>
              )}

              {resource.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {resource.topics.slice(0, 5).map((topic, i) => (
                    <span key={i} className="badge bg-gray-100 text-gray-600 text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Match Score */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center mb-1">
                <span className="text-2xl font-bold text-primary-700">{matchScore}</span>
              </div>
              <span className="text-xs text-gray-500">Match</span>
            </div>
          </div>

          {/* AI Explanation */}
          {resource.aiExplanation && (
            <div className="mb-3">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center space-x-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Info className="w-4 h-4" />
                <span>Why AI recommends this</span>
              </button>
              {showExplanation && (
                <div className="mt-2 p-3 bg-primary-50 rounded-lg text-sm text-gray-700">
                  {resource.aiExplanation}
                </div>
              )}
            </div>
          )}

          {/* Scores */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm text-gray-600">
                {Math.round(resource.credibilityScore * 100)}% Credible
              </span>
            </div>
            {resource.popularityScore > 0.5 && (
              <div className="flex items-center space-x-1">
                <ThumbsUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Popular</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Resource</span>
            </a>

            <button
              onClick={() => onSave(resource)}
              className={`btn ${isSaved ? 'bg-green-100 text-green-700' : 'btn-secondary'} flex items-center space-x-2`}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck className="w-4 h-4" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="w-4 h-4" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceFinderPage;
