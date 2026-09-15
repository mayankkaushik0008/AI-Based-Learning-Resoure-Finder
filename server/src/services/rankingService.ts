import { NormalizedResource, DifficultyLevel } from '../types/resource.types';

// Ranking weights (must sum to 1.0)
const WEIGHTS = {
  RELEVANCE: 0.4,
  CREDIBILITY: 0.2,
  STAGE_MATCH: 0.15,
  DIFFICULTY_MATCH: 0.1,
  FRESHNESS: 0.1,
  POPULARITY: 0.05,
};

interface RankingContext {
  keywords: string[];
  technologies: string[];
  stage: string;
  skillLevel: string;
  preferredTypes?: string[];
}

export const rankResources = (
  resources: NormalizedResource[],
  context: RankingContext
): NormalizedResource[] => {
  const rankedResources = resources.map((resource) => {
    const relevanceScore = calculateRelevanceScore(resource, context);
    const stageMatchScore = calculateStageMatchScore(resource, context.stage);
    const difficultyMatchScore = calculateDifficultyMatchScore(resource, context.skillLevel);
    const freshnessScore = calculateFreshnessScore(resource);

    const overallScore =
      relevanceScore * WEIGHTS.RELEVANCE +
      resource.credibilityScore * WEIGHTS.CREDIBILITY +
      stageMatchScore * WEIGHTS.STAGE_MATCH +
      difficultyMatchScore * WEIGHTS.DIFFICULTY_MATCH +
      freshnessScore * WEIGHTS.FRESHNESS +
      resource.popularityScore * WEIGHTS.POPULARITY;

    return {
      ...resource,
      relevanceScore,
      stageMatchScore,
      difficultyMatchScore,
      freshnessScore,
      overallScore,
    };
  });

  // Sort by overall score (descending)
  return rankedResources.sort((a, b) => (b.overallScore || 0) - (a.overallScore || 0));
};

const calculateRelevanceScore = (
  resource: NormalizedResource,
  context: RankingContext
): number => {
  let score = 0;
  const searchableText = `${resource.title} ${resource.description}`.toLowerCase();

  // Keyword matching
  const matchedKeywords = context.keywords.filter((keyword) =>
    searchableText.includes(keyword.toLowerCase())
  );
  score += (matchedKeywords.length / Math.max(context.keywords.length, 1)) * 0.5;

  // Technology matching
  const matchedTechs = context.technologies.filter(
    (tech) =>
      searchableText.includes(tech.toLowerCase()) ||
      resource.topics.some((topic) => topic.toLowerCase().includes(tech.toLowerCase()))
  );
  score += (matchedTechs.length / Math.max(context.technologies.length, 1)) * 0.3;

  // Topic overlap
  const topicOverlap = resource.topics.filter((topic) =>
    context.keywords.some((keyword) => topic.toLowerCase().includes(keyword.toLowerCase()))
  );
  score += (topicOverlap.length / Math.max(resource.topics.length, 1)) * 0.2;

  return Math.min(score, 1.0);
};

const calculateStageMatchScore = (resource: NormalizedResource, stage: string): number => {
  const stageResourceMap: Record<string, string[]> = {
    IDEA: ['ARTICLE', 'PAPER', 'COURSE'],
    RESEARCH: ['PAPER', 'ARTICLE', 'DOCUMENTATION'],
    LEARNING: ['VIDEO', 'TUTORIAL', 'COURSE', 'ARTICLE'],
    DEVELOPMENT: ['TUTORIAL', 'DOCUMENTATION', 'GITHUB', 'VIDEO'],
    TESTING: ['ARTICLE', 'DOCUMENTATION', 'TUTORIAL'],
    DOCUMENTATION: ['ARTICLE', 'DOCUMENTATION', 'TUTORIAL'],
    PRESENTATION: ['ARTICLE', 'VIDEO', 'PAPER'],
  };

  const preferredTypes = stageResourceMap[stage] || ['VIDEO', 'ARTICLE', 'TUTORIAL'];
  const typeMatch = preferredTypes.includes(resource.type);

  return typeMatch ? 1.0 : 0.5;
};

const calculateDifficultyMatchScore = (
  resource: NormalizedResource,
  userSkillLevel: string
): number => {
  if (!resource.difficulty) return 0.7; // Neutral score if difficulty not specified

  const difficultyLevels = [DifficultyLevel.BEGINNER, DifficultyLevel.INTERMEDIATE, DifficultyLevel.ADVANCED];
  const resourceLevel = difficultyLevels.indexOf(resource.difficulty as DifficultyLevel);
  const userLevel = difficultyLevels.indexOf(userSkillLevel as DifficultyLevel);

  if (userLevel === -1 || resourceLevel === -1) return 0.7;

  // Perfect match
  if (resourceLevel === userLevel) return 1.0;

  // One level difference
  if (Math.abs(resourceLevel - userLevel) === 1) return 0.7;

  // Two levels difference
  return 0.4;
};

const calculateFreshnessScore = (resource: NormalizedResource): number => {
  if (!resource.publishedDate) return 0.5; // Neutral score if date not available

  const now = Date.now();
  const publishedTime = resource.publishedDate.getTime();
  const ageInDays = (now - publishedTime) / (1000 * 60 * 60 * 24);

  // Scoring based on age
  if (ageInDays < 180) return 1.0; // Less than 6 months: 100%
  if (ageInDays < 365) return 0.9; // Less than 1 year: 90%
  if (ageInDays < 730) return 0.7; // Less than 2 years: 70%
  if (ageInDays < 1095) return 0.5; // Less than 3 years: 50%
  return 0.3; // Older than 3 years: 30%
};

export const generateExplanation = (
  resource: NormalizedResource,
  context: RankingContext
): string => {
  const reasons: string[] = [];

  // Relevance
  if (resource.relevanceScore && resource.relevanceScore > 0.7) {
    reasons.push('highly relevant to your project topics');
  }

  // Credibility
  if (resource.credibilityScore > 0.8) {
    reasons.push('from a credible and trusted source');
  }

  // Stage match
  if (resource.stageMatchScore && resource.stageMatchScore > 0.9) {
    reasons.push(`perfect for your ${context.stage.toLowerCase()} phase`);
  }

  // Difficulty
  if (resource.difficultyMatchScore && resource.difficultyMatchScore > 0.9) {
    reasons.push(`matches your ${context.skillLevel.toLowerCase()} skill level`);
  }

  // Freshness
  if (resource.freshnessScore && resource.freshnessScore > 0.9) {
    reasons.push('recently published with up-to-date content');
  }

  // Popularity
  if (resource.popularityScore > 0.8) {
    reasons.push('highly popular in the community');
  }

  if (reasons.length === 0) {
    return 'This resource covers relevant topics for your project.';
  }

  if (reasons.length === 1) {
    return `This resource is ${reasons[0]}.`;
  }

  if (reasons.length === 2) {
    return `This resource is ${reasons[0]} and ${reasons[1]}.`;
  }

  const lastReason = reasons.pop();
  return `This resource is ${reasons.join(', ')}, and ${lastReason}.`;
};

export default {
  rankResources,
  generateExplanation,
};
