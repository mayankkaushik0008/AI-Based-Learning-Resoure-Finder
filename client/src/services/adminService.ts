import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (page: number = 1, limit: number = 20) => {
    const response = await api.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  getResources: async (page: number = 1, limit: number = 20, type?: string) => {
    const response = await api.get('/admin/resources', {
      params: { page, limit, type },
    });
    return response.data;
  },
};
