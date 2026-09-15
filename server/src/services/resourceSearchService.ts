import { NormalizedResource, SearchQuery, SearchFilters } from '../types/resource.types';
import youtubeService from './youtubeService';
import githubService from './githubService';
import academicService from './academicService';
import { rankResources, generateExplanation } from './rankingService';

interface SearchOptions {
  query: SearchQuery;
  filters?: SearchFilters;
  limit?: number;
}

export const searchResources = async (
  options: SearchOptions
): Promise<NormalizedResource[]> => {
  const { query, filters, limit = 30 } = options;
  const allResources: NormalizedResource[] = [];

  // Determine which sources to search based on filters and preferences
  const searchYouTube =
    !filters?.sources || filters.sources.includes('YOUTUBE' as any);
  const searchGitHub =
    !filters?.sources || filters.sources.includes('GITHUB' as any);
  const searchAcademic =
    !filters?.sources || filters.sources.includes('OPENALEX' as any);

  // Determine resource type preferences
  const wantsVideos =
    !filters?.types || filters.types.some((t) => t === 'VIDEO');
  const wantsGitHub =
    !filters?.types || filters.types.some((t) => t === 'GITHUB');
  const wantsPapers =
    !filters?.types || filters.types.some((t) => t === 'PAPER');

  // Build search queries
  const searchTerms = [
    query.topic,
    ...query.technologies.slice(0, 2),
    ...query.keywords.slice(0, 3),
  ].join(' ');

  try {
    // Parallel API calls
    const searchPromises: Promise<NormalizedResource[]>[] = [];

    if (searchYouTube && wantsVideos) {
      searchPromises.push(
        youtubeService.searchYouTube(searchTerms, Math.ceil(limit / 3))
      );
    }

    if (searchGitHub && wantsGitHub) {
      const githubQuery = query.technologies.join(' ') || query.topic;
      searchPromises.push(
        githubService.searchGitHub(githubQuery, Math.ceil(limit / 3))
      );
    }

    if (searchAcademic && wantsPapers) {
      searchPromises.push(
        academicService.searchAcademicPapers(query.topic, Math.ceil(limit / 3))
      );
    }

    // Wait for all searches to complete
    const results = await Promise.allSettled(searchPromises);

    // Collect successful results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allResources.push(...result.value);
      }
    });

    // Apply filters
    let filteredResources = allResources;

    if (filters?.types && filters.types.length > 0) {
      filteredResources = filteredResources.filter((r) =>
        filters.types!.includes(r.type)
      );
    }

    if (filters?.difficulty) {
      filteredResources = filteredResources.filter(
        (r) => !r.difficulty || r.difficulty === filters.difficulty
      );
    }

    if (filters?.minScore) {
      filteredResources = filteredResources.filter(
        (r) => r.credibilityScore >= filters.minScore!
      );
    }

    if (filters?.dateFrom) {
      filteredResources = filteredResources.filter(
        (r) =>
          !r.publishedDate ||
          r.publishedDate >= filters.dateFrom!
      );
    }

    if (filters?.dateTo) {
      filteredResources = filteredResources.filter(
        (r) =>
          !r.publishedDate ||
          r.publishedDate <= filters.dateTo!
      );
    }

    // Rank resources
    const rankedResources = rankResources(filteredResources, {
      keywords: query.keywords,
      technologies: query.technologies,
      stage: query.stage,
      skillLevel: query.skillLevel,
      preferredTypes: query.preferredTypes,
    });

    // Add AI explanations to top resources
    const topResources = rankedResources.slice(0, limit);
    topResources.forEach((resource) => {
      resource.aiExplanation = generateExplanation(resource, {
        keywords: query.keywords,
        technologies: query.technologies,
        stage: query.stage,
        skillLevel: query.skillLevel,
      });
    });

    return topResources;
  } catch (error) {
    console.error('Resource search error:', error);
    return [];
  }
};

export const deduplicateResources = (
  resources: NormalizedResource[]
): NormalizedResource[] => {
  const seen = new Set<string>();
  const deduplicated: NormalizedResource[] = [];

  for (const resource of resources) {
    // Create a unique key based on URL or external ID
    const key = resource.url.toLowerCase();

    if (!seen.has(key)) {
      seen.add(key);
      deduplicated.push(resource);
    }
  }

  return deduplicated;
};

export default {
  searchResources,
  deduplicateResources,
};
