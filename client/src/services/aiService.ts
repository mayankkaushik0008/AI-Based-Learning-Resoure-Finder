import api from './api';

export const aiService = {
  analyzeProject: async (projectId: string) => {
    const response = await api.post('/ai/analyze-project', { projectId });
    return response.data;
  },

  chat: async (message: string, projectId?: string) => {
    const response = await api.post('/ai/chat', { message, projectId });
    return response.data;
  },

  getChatHistory: async (projectId?: string, limit?: number) => {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (limit) params.limit = limit;
    
    const response = await api.get('/ai/chat/history', { params });
    return response.data;
  },
};
