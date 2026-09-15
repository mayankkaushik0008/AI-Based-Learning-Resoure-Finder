// Resource Types

export enum ResourceType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  PAPER = 'PAPER',
  TUTORIAL = 'TUTORIAL',
  COURSE = 'COURSE',
  DOCUMENTATION = 'DOCUMENTATION',
  GITHUB = 'GITHUB',
  BOOK = 'BOOK',
}

export enum ResourceSource {
  YOUTUBE = 'YOUTUBE',
  GITHUB = 'GITHUB',
  OPENALEX = 'OPENALEX',
  WEB = 'WEB',
  MOCK = 'MOCK',
}

export enum DifficultyLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface NormalizedResource {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  source: ResourceSource;
  author?: string;
  thumbnail?: string;
  publishedDate?: Date;
  duration?: string;
  topics: string[];
  difficulty?: DifficultyLevel;
  language?: string;
  credibilityScore: number;
  popularityScore: number;
  externalId?: string;
  
  // Dynamic scores (not stored in DB)
  relevanceScore?: number;
  stageMatchScore?: number;
  difficultyMatchScore?: number;
  freshnessScore?: number;
  overallScore?: number;
  aiExplanation?: string;
}

export interface SearchQuery {
  topic: string;
  subtopics: string[];
  technologies: string[];
  skills: string[];
  stage: string;
  skillLevel: DifficultyLevel;
  keywords: string[];
  preferredTypes?: ResourceType[];
}

export interface SearchFilters {
  types?: ResourceType[];
  sources?: ResourceSource[];
  difficulty?: DifficultyLevel;
  minScore?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface SearchOptions {
  query: SearchQuery;
  filters?: SearchFilters;
  limit?: number;
  offset?: number;
  sortBy?: 'relevance' | 'date' | 'popularity' | 'credibility';
}
