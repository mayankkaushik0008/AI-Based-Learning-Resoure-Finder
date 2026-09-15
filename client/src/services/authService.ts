import api from './api';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  educationLevel?: string;
  fieldOfStudy?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  educationLevel?: string;
  fieldOfStudy?: string;
  skillLevel?: string;
  interests?: string[];
  preferredResources?: string[];
}

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
