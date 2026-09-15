import api from './api';

export const learningService = {
  getLearningPath: async (projectId: string) => {
    const response = await api.get(`/learning/path/${projectId}`);
    return response.data;
  },

  generateLearningPath: async (projectId: string) => {
    const response = await api.post(`/learning/path/${projectId}/generate`);
    return response.data;
  },

  completeItem: async (itemId: string, isCompleted: boolean) => {
    const response = await api.post(`/learning/path/item/${itemId}/complete`, {
      isCompleted,
    });
    return response.data;
  },
};
