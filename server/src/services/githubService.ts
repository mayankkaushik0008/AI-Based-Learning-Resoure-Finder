import axios from 'axios';
import { NormalizedResource, ResourceType, ResourceSource } from '../types/resource.types';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

export const searchGitHub = async (
  query: string,
  maxResults: number = 10
): Promise<NormalizedResource[]> => {
  if (DEMO_MODE || !GITHUB_TOKEN) {
    return generateMockGitHubResults(query, maxResults);
  }

  try {
    const response = await axios.get(
      'https://api.github.com/search/repositories',
      {
        params: {
          q: query,
          sort: 'stars',
          order: 'desc',
          per_page: maxResults,
        },
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return response.data.items.map((repo: any) => normalizeGitHubRepo(repo));
  } catch (error: any) {
    console.error('GitHub API Error:', error.response?.data || error.message);
    return generateMockGitHubResults(query, maxResults);
  }
};

const normalizeGitHubRepo = (repo: any): NormalizedResource => {
  return {
    title: repo.full_name,
    description: repo.description || 'GitHub repository',
    url: repo.html_url,
    type: ResourceType.GITHUB,
    source: ResourceSource.GITHUB,
    author: repo.owner.login,
    thumbnail: repo.owner.avatar_url,
    publishedDate: new Date(repo.created_at),
    topics: repo.topics || [],
    credibilityScore: calculateGitHubCredibility(repo),
    popularityScore: calculateGitHubPopularity(repo),
    externalId: repo.id.toString(),
    language: repo.language || 'Various',
  };
};

const calculateGitHubCredibility = (repo: any): number => {
  let score = 0.5;

  // Stars boost
  if (repo.stargazers_count > 10000) score += 0.3;
  else if (repo.stargazers_count > 1000) score += 0.2;
  else if (repo.stargazers_count > 100) score += 0.1;

  // Active maintenance
  const lastUpdate = new Date(repo.updated_at);
  const monthsSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24 * 30);
  if (monthsSinceUpdate < 3) score += 0.1;
  else if (monthsSinceUpdate < 12) score += 0.05;

  // Documentation
  if (repo.has_wiki || repo.has_pages) score += 0.05;

  return Math.min(score, 1.0);
};

const calculateGitHubPopularity = (repo: any): number => {
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const watchers = repo.watchers_count;

  // Logarithmic scaling
  const score = Math.min(
    (Math.log10(stars + 1) / 5 +
      Math.log10(forks + 1) / 6 +
      Math.log10(watchers + 1) / 6) /
      3,
    1.0
  );

  return score;
};

const generateMockGitHubResults = (query: string, count: number): NormalizedResource[] => {
  const mockRepos = [
    {
      name: `awesome-${query}`,
      fullName: `awesome/${query}`,
      description: `A curated list of awesome ${query} resources, libraries, and tools`,
      stars: 25000,
      forks: 3500,
      language: 'Markdown',
    },
    {
      name: `${query}-tutorial`,
      fullName: `learning/${query}-tutorial`,
      description: `Complete ${query} tutorial with examples and exercises`,
      stars: 8500,
      forks: 1200,
      language: 'JavaScript',
    },
    {
      name: `${query}-starter`,
      fullName: `templates/${query}-starter`,
      description: `Production-ready ${query} starter template with best practices`,
      stars: 5200,
      forks: 890,
      language: 'TypeScript',
    },
    {
      name: `${query}-examples`,
      fullName: `examples/${query}-examples`,
      description: `Collection of ${query} code examples and demos`,
      stars: 3100,
      forks: 670,
      language: 'JavaScript',
    },
    {
      name: `learn-${query}`,
      fullName: `education/learn-${query}`,
      description: `Step-by-step guide to learning ${query} from basics to advanced`,
      stars: 2400,
      forks: 420,
      language: 'Python',
    },
  ];

  return mockRepos.slice(0, count).map((repo, index) => ({
    title: repo.fullName,
    description: repo.description,
    url: `https://github.com/${repo.fullName}`,
    type: ResourceType.GITHUB,
    source: ResourceSource.GITHUB,
    author: repo.fullName.split('/')[0],
    thumbnail: `https://github.com/${repo.fullName.split('/')[0]}.png`,
    publishedDate: new Date(Date.now() - index * 180 * 24 * 60 * 60 * 1000),
    topics: [query, 'tutorial', 'learning'],
    credibilityScore: 0.85 - index * 0.05,
    popularityScore: 0.9 - index * 0.1,
    externalId: `mock-${index}`,
    language: repo.language,
  }));
};

export default { searchGitHub };
