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

export interface Resource {
  id?: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  source: ResourceSource;
  author?: string;
  thumbnail?: string;
  publishedDate?: string;
  duration?: string;
  topics: string[];
  difficulty?: string;
  language?: string;
  credibilityScore: number;
  popularityScore: number;
  externalId?: string;
  
  // Dynamic scores
  relevanceScore?: number;
  stageMatchScore?: number;
  difficultyMatchScore?: number;
  freshnessScore?: number;
  overallScore?: number;
  aiExplanation?: string;
}

export interface SearchFilters {
  types?: ResourceType[];
  sources?: ResourceSource[];
  difficulty?: string;
  minScore?: number;
  dateFrom?: string;
  dateTo?: string;
}
