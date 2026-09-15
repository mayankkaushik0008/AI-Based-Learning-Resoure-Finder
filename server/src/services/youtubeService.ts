import axios from 'axios';
import { NormalizedResource, ResourceType, ResourceSource } from '../types/resource.types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const DEMO_MODE = process.env.DEMO_MODE === 'true';

export const searchYouTube = async (
  query: string,
  maxResults: number = 10
): Promise<NormalizedResource[]> => {
  if (DEMO_MODE || !YOUTUBE_API_KEY) {
    return generateMockYouTubeResults(query, maxResults);
  }

  try {
    const response = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          q: query,
          type: 'video',
          maxResults,
          key: YOUTUBE_API_KEY,
          videoDuration: 'medium', // Prefer 4-20 minute videos
          relevanceLanguage: 'en',
          safeSearch: 'strict',
        },
      }
    );

    return response.data.items.map((item: any) => normalizeYouTubeVideo(item));
  } catch (error: any) {
    console.error('YouTube API Error:', error.response?.data || error.message);
    return generateMockYouTubeResults(query, maxResults);
  }
};

const normalizeYouTubeVideo = (item: any): NormalizedResource => {
  const snippet = item.snippet;
  const videoId = item.id.videoId;

  return {
    title: snippet.title,
    description: snippet.description,
    url: `https://www.youtube.com/watch?v=${videoId}`,
    type: ResourceType.VIDEO,
    source: ResourceSource.YOUTUBE,
    author: snippet.channelTitle,
    thumbnail: snippet.thumbnails?.high?.url || snippet.thumbnails?.default?.url,
    publishedDate: new Date(snippet.publishedAt),
    topics: extractTopics(snippet.title + ' ' + snippet.description),
    credibilityScore: calculateYouTubeCredibility(item),
    popularityScore: 0.7, // Would need additional API call for actual stats
    externalId: videoId,
    language: 'en',
  };
};

const calculateYouTubeCredibility = (item: any): number => {
  // Base credibility for YouTube educational content
  let score = 0.6;

  const channelTitle = item.snippet.channelTitle.toLowerCase();
  const title = item.snippet.title.toLowerCase();

  // Boost for known educational channels
  const eduKeywords = ['tutorial', 'course', 'academy', 'university', 'freecodecamp', 'traversy', 'programming', 'coding'];
  if (eduKeywords.some((keyword) => channelTitle.includes(keyword) || title.includes(keyword))) {
    score += 0.2;
  }

  return Math.min(score, 1.0);
};

const extractTopics = (text: string): string[] => {
  const topics: string[] = [];
  const techKeywords = [
    'react', 'vue', 'angular', 'node', 'python', 'javascript', 'typescript',
    'java', 'c++', 'rust', 'go', 'php', 'ruby', 'swift', 'kotlin',
    'mongodb', 'postgresql', 'mysql', 'redis', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'machine learning', 'ai', 'data science',
    'web development', 'mobile development', 'backend', 'frontend', 'fullstack',
  ];

  const lowerText = text.toLowerCase();
  techKeywords.forEach((keyword) => {
    if (lowerText.includes(keyword)) {
      topics.push(keyword);
    }
  });

  return [...new Set(topics)].slice(0, 5);
};

const generateMockYouTubeResults = (query: string, count: number): NormalizedResource[] => {
  const mockVideos = [
    {
      title: `Complete ${query} Tutorial for Beginners`,
      channelTitle: 'CodeAcademy Pro',
      description: `Learn ${query} from scratch with this comprehensive tutorial. Perfect for beginners looking to master the fundamentals.`,
      videoId: 'mock-video-1',
    },
    {
      title: `${query} - Full Course 2024`,
      channelTitle: 'FreeCodeCamp',
      description: `A complete ${query} course covering everything from basics to advanced concepts. Includes hands-on projects and real-world examples.`,
      videoId: 'mock-video-2',
    },
    {
      title: `${query} Crash Course`,
      channelTitle: 'Traversy Media',
      description: `Quick and practical ${query} crash course. Learn the essentials in under an hour.`,
      videoId: 'mock-video-3',
    },
    {
      title: `Build Real Projects with ${query}`,
      channelTitle: 'Programming with Josh',
      description: `Hands-on ${query} tutorial where we build 3 real-world projects from scratch.`,
      videoId: 'mock-video-4',
    },
    {
      title: `${query} Best Practices and Patterns`,
      channelTitle: 'Tech With Tim',
      description: `Learn industry best practices and design patterns for ${query} development.`,
      videoId: 'mock-video-5',
    },
  ];

  return mockVideos.slice(0, count).map((video, index) => ({
    title: video.title,
    description: video.description,
    url: `https://www.youtube.com/watch?v=${video.videoId}`,
    type: ResourceType.VIDEO,
    source: ResourceSource.YOUTUBE,
    author: video.channelTitle,
    thumbnail: `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`,
    publishedDate: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000),
    topics: extractTopics(query),
    credibilityScore: 0.8,
    popularityScore: 0.9 - index * 0.1,
    externalId: video.videoId,
    language: 'en',
  }));
};

export default { searchYouTube };
