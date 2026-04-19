import api from './api';
import { User } from '../types';

export const userService = {
  getUser: async (id: number): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};
