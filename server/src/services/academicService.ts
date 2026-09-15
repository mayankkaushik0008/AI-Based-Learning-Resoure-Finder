import axios from 'axios';
import { NormalizedResource, ResourceType, ResourceSource, DifficultyLevel } from '../types/resource.types';

const OPENALEX_EMAIL = process.env.OPENALEX_EMAIL;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

export const searchAcademicPapers = async (
  query: string,
  maxResults: number = 10
): Promise<NormalizedResource[]> => {
  if (DEMO_MODE || !OPENALEX_EMAIL) {
    return generateMockAcademicResults(query, maxResults);
  }

  try {
    const response = await axios.get('https://api.openalex.org/works', {
      params: {
        search: query,
        per_page: maxResults,
        mailto: OPENALEX_EMAIL,
        filter: 'type:article',
        sort: 'cited_by_count:desc',
      },
    });

    return response.data.results.map((work: any) => normalizeAcademicPaper(work));
  } catch (error: any) {
    console.error('OpenAlex API Error:', error.message);
    return generateMockAcademicResults(query, maxResults);
  }
};

const normalizeAcademicPaper = (work: any): NormalizedResource => {
  const authors = work.authorships
    ?.slice(0, 3)
    .map((a: any) => a.author?.display_name)
    .filter(Boolean)
    .join(', ') || 'Unknown';

  return {
    title: work.title || 'Untitled',
    description: work.abstract || work.title || '',
    url: work.doi ? `https://doi.org/${work.doi}` : work.url || '#',
    type: ResourceType.PAPER,
    source: ResourceSource.OPENALEX,
    author: authors,
    publishedDate: work.publication_date ? new Date(work.publication_date) : undefined,
    topics: work.concepts?.slice(0, 5).map((c: any) => c.display_name) || [],
    difficulty: DifficultyLevel.ADVANCED,
    credibilityScore: calculateAcademicCredibility(work),
    popularityScore: calculateAcademicPopularity(work),
    externalId: work.id,
    language: 'en',
  };
};

const calculateAcademicCredibility = (work: any): number => {
  let score = 0.7; // Base credibility for academic papers

  // Citation count
  const citations = work.cited_by_count || 0;
  if (citations > 100) score += 0.2;
  else if (citations > 50) score += 0.15;
  else if (citations > 10) score += 0.1;

  // Peer-reviewed bonus
  if (work.type === 'article') score += 0.05;

  return Math.min(score, 1.0);
};

const calculateAcademicPopularity = (work: any): number => {
  const citations = work.cited_by_count || 0;
  // Logarithmic scale for citations
  return Math.min(Math.log10(citations + 1) / 4, 1.0);
};

const generateMockAcademicResults = (query: string, count: number): NormalizedResource[] => {
  const mockPapers = [
    {
      title: `A Comprehensive Survey of ${query}: Methods and Applications`,
      authors: 'Smith, J., Johnson, A., Williams, B.',
      abstract: `This paper provides a comprehensive survey of ${query}, examining current methods, applications, and future directions in the field.`,
      citations: 342,
      year: 2023,
    },
    {
      title: `Deep Learning Approaches to ${query}`,
      authors: 'Chen, L., Garcia, M., Kumar, R.',
      abstract: `We present novel deep learning approaches for ${query}, demonstrating significant improvements over traditional methods.`,
      citations: 156,
      year: 2024,
    },
    {
      title: `${query}: A Systematic Review and Meta-Analysis`,
      authors: 'Brown, K., Davis, E.',
      abstract: `This systematic review analyzes recent research in ${query}, providing evidence-based insights and recommendations.`,
      citations: 89,
      year: 2023,
    },
    {
      title: `Practical Applications of ${query} in Industry`,
      authors: 'Taylor, P., Anderson, S., Martinez, C.',
      abstract: `Exploring real-world applications of ${query} across various industries and sectors.`,
      citations: 67,
      year: 2024,
    },
    {
      title: `Future Trends in ${query} Research`,
      authors: 'Wilson, T., Lee, H.',
      abstract: `An analysis of emerging trends and future research directions in ${query}.`,
      citations: 45,
      year: 2024,
    },
  ];

  return mockPapers.slice(0, count).map((paper, index) => ({
    title: paper.title,
    description: paper.abstract,
    url: `https://doi.org/10.1000/mock.${index}`,
    type: ResourceType.PAPER,
    source: ResourceSource.OPENALEX,
    author: paper.authors,
    publishedDate: new Date(`${paper.year}-01-01`),
    topics: [query, 'research', 'academic'],
    difficulty: DifficultyLevel.ADVANCED,
    credibilityScore: 0.9 - index * 0.05,
    popularityScore: 0.85 - index * 0.1,
    externalId: `mock-paper-${index}`,
    language: 'en',
  }));
};

export default { searchAcademicPapers };
