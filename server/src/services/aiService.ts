import axios from 'axios';
import { ProjectAnalysis } from '../types/project.types';

const DEMO_MODE = process.env.DEMO_MODE === 'true';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const callOpenAI = async (messages: OpenAIMessage[]): Promise<string> => {
  if (DEMO_MODE || !OPENAI_API_KEY) {
    // Demo mode - return simulated response
    return generateDemoResponse(messages);
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: OPENAI_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error('OpenAI API Error:', error.response?.data || error.message);
    // Fallback to demo mode on error
    return generateDemoResponse(messages);
  }
};

const generateDemoResponse = (messages: OpenAIMessage[]): string => {
  const userMessage = messages.find((m) => m.role === 'user')?.content || '';

  if (userMessage.includes('analyze') || userMessage.includes('project')) {
    return JSON.stringify({
      mainTopic: 'Web Development',
      subtopics: ['Frontend Development', 'Backend Development', 'Database Design', 'API Development'],
      technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
      requiredSkills: ['JavaScript', 'REST APIs', 'Database Management', 'UI/UX Design'],
      learningObjectives: [
        'Master modern React development',
        'Build RESTful APIs with Node.js',
        'Implement secure authentication',
        'Design scalable database schemas',
      ],
      searchKeywords: [
        'React tutorial',
        'Node.js Express',
        'MongoDB CRUD',
        'REST API best practices',
        'React hooks',
        'Authentication JWT',
      ],
      recommendedResourceTypes: ['VIDEO', 'TUTORIAL', 'DOCUMENTATION', 'ARTICLE'],
      estimatedComplexity: 'INTERMEDIATE',
    });
  }

  return 'AI service is in demo mode. Configure OPENAI_API_KEY for full functionality.';
};

export const analyzeProject = async (
  title: string,
  description: string,
  domain: string,
  technologies: string[],
  skillLevel: string,
  currentStage: string
): Promise<ProjectAnalysis> => {
  const systemPrompt = `You are an AI educational advisor that analyzes student projects and extracts key learning information. 
Your task is to analyze project descriptions and return structured data in JSON format.
Always respond with valid JSON only, no additional text.`;

  const userPrompt = `Analyze this project and extract key information:

Title: ${title}
Description: ${description}
Domain: ${domain}
Technologies: ${technologies.join(', ')}
Skill Level: ${skillLevel}
Current Stage: ${currentStage}

Return a JSON object with:
- mainTopic: The primary subject area
- subtopics: Array of 4-6 related subtopics
- technologies: Array of specific technologies mentioned or implied
- requiredSkills: Array of 4-6 skills needed
- learningObjectives: Array of 4-6 clear learning goals
- searchKeywords: Array of 6-10 effective search terms for finding resources
- recommendedResourceTypes: Array of resource types (VIDEO, ARTICLE, TUTORIAL, PAPER, DOCUMENTATION, COURSE, GITHUB)
- estimatedComplexity: One of BEGINNER, INTERMEDIATE, ADVANCED`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    const analysis = JSON.parse(response);
    return analysis;
  } catch (error) {
    console.error('Project analysis error:', error);
    // Return fallback analysis
    return {
      mainTopic: domain,
      subtopics: [domain],
      technologies: technologies,
      requiredSkills: ['Research', 'Problem Solving', 'Implementation'],
      learningObjectives: [`Learn ${domain}`, 'Build practical project'],
      searchKeywords: [title, domain, ...technologies],
      recommendedResourceTypes: ['VIDEO', 'TUTORIAL', 'ARTICLE'],
      estimatedComplexity: skillLevel,
    };
  }
};

export const generateResourceExplanation = async (
  resourceTitle: string,
  resourceDescription: string,
  projectContext: string,
  stage: string
): Promise<string> => {
  const systemPrompt = `You are an AI learning advisor. Explain why a specific resource is relevant to a student's project in 1-2 concise sentences.`;

  const userPrompt = `Resource: ${resourceTitle}
Description: ${resourceDescription}
Project Context: ${projectContext}
Current Stage: ${stage}

Explain why this resource is recommended:`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    return response.trim();
  } catch (error) {
    return `This resource is relevant to your ${stage.toLowerCase()} phase and covers topics related to your project.`;
  }
};

export const generateLearningPath = async (
  projectTitle: string,
  projectDescription: string,
  technologies: string[],
  skillLevel: string
): Promise<Array<{ title: string; description: string; order: number }>> => {
  const systemPrompt = `You are an educational AI that creates step-by-step learning paths for projects. 
Return a JSON array of 5-7 learning steps, each with title and description.`;

  const userPrompt = `Create a learning path for:
Project: ${projectTitle}
Description: ${projectDescription}
Technologies: ${technologies.join(', ')}
Skill Level: ${skillLevel}

Return JSON array of steps with: title, description, order (1-7)`;

  try {
    const response = await callOpenAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);

    return JSON.parse(response);
  } catch (error) {
    // Fallback learning path
    return [
      { title: 'Fundamentals', description: 'Learn the basic concepts', order: 1 },
      { title: 'Core Technologies', description: `Master ${technologies[0] || 'key technologies'}`, order: 2 },
      { title: 'Practical Implementation', description: 'Build hands-on projects', order: 3 },
      { title: 'Advanced Concepts', description: 'Explore advanced topics', order: 4 },
      { title: 'Best Practices', description: 'Learn industry standards', order: 5 },
    ];
  }
};

export const chatWithAI = async (
  userMessage: string,
  conversationHistory: OpenAIMessage[],
  projectContext?: string
): Promise<string> => {
  const systemPrompt = `You are LearnWise AI Assistant, a helpful educational AI that guides students in their learning journey.
${projectContext ? `Current Project Context: ${projectContext}` : ''}
Provide clear, encouraging, and actionable advice. Keep responses concise and practical.`;

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    ...conversationHistory.slice(-10), // Keep last 10 messages for context
    { role: 'user', content: userMessage },
  ];

  try {
    const response = await callOpenAI(messages);
    return response;
  } catch (error) {
    return "I'm here to help with your learning journey! Due to current limitations, I'm in demo mode. Try asking about learning resources, project guidance, or study strategies.";
  }
};

export default {
  analyzeProject,
  generateResourceExplanation,
  generateLearningPath,
  chatWithAI,
};
