// Project Types

export enum ProjectStage {
  IDEA = 'IDEA',
  RESEARCH = 'RESEARCH',
  LEARNING = 'LEARNING',
  DEVELOPMENT = 'DEVELOPMENT',
  TESTING = 'TESTING',
  DOCUMENTATION = 'DOCUMENTATION',
  PRESENTATION = 'PRESENTATION',
}

export enum ProjectType {
  ACADEMIC = 'ACADEMIC',
  PERSONAL = 'PERSONAL',
  FINAL_YEAR = 'FINAL_YEAR',
  RESEARCH = 'RESEARCH',
  HACKATHON = 'HACKATHON',
  COMPETITION = 'COMPETITION',
}

export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export interface ProjectAnalysis {
  mainTopic: string;
  subtopics: string[];
  technologies: string[];
  requiredSkills: string[];
  learningObjectives: string[];
  searchKeywords: string[];
  recommendedResourceTypes: string[];
  estimatedComplexity: string;
}
