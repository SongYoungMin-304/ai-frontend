import api from './api';

export const freeResourceService = {
  async subscribe(email: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>('/free-resources/subscribe', { email });
    return response.data;
  },
};
