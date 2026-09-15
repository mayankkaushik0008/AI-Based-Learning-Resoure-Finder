import api from './api';
import { SearchFilters } from '../types/resource.types';

export const resourceService = {
  searchResources: async (data: {
    projectId?: string;
    customQuery?: string;
    stage?: string;
    skillLevel?: string;
    preferredTypes?: string[];
    filters?: SearchFilters;
  }) => {
    const response = await api.post('/resources/search', data);
    return response.data;
  },

  getSavedResources: async (projectId?: string, collectionId?: string) => {
    const params: any = {};
    if (projectId) params.projectId = projectId;
    if (collectionId) params.collectionId = collectionId;
    
    const response = await api.get('/resources/saved', { params });
    return response.data;
  },

  saveResource: async (data: {
    resourceId: string;
    projectId?: string;
    collectionId?: string;
    notes?: string;
  }) => {
    const response = await api.post('/resources/save', data);
    return response.data;
  },

  unsaveResource: async (resourceId: string) => {
    const response = await api.post('/resources/unsave', { resourceId });
    return response.data;
  },

  rateResource: async (data: {
    resourceId: string;
    rating: number;
    feedback?: string;
    isUseful?: boolean;
  }) => {
    const response = await api.post('/resources/rate', data);
    return response.data;
  },
};
