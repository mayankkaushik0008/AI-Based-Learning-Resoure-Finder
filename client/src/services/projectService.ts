import api from './api';

export interface Project {
  id: string;
  userId: string;
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  skillLevel: string;
  projectType: string;
  currentStage: string;
  goals?: string;
  deadline?: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  _count?: {
    savedResources: number;
    searchHistory?: number;
  };
}

export interface CreateProjectData {
  title: string;
  description: string;
  domain: string;
  technologies: string[];
  skillLevel: string;
  projectType: string;
  currentStage: string;
  goals?: string;
  deadline?: string;
}

export const projectService = {
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProject: async (id: string) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectData) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  updateProject: async (id: string, data: Partial<CreateProjectData>) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  updateProjectStage: async (id: string, currentStage: string) => {
    const response = await api.patch(`/projects/${id}/stage`, { currentStage });
    return response.data;
  },

  getProjectStats: async () => {
    const response = await api.get('/projects/stats');
    return response.data;
  },
};
