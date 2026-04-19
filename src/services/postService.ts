import api from './api';
import { Post, PostsResponse } from '../types';

export const postService = {
  getPosts: async (page: number = 0): Promise<PostsResponse> => {
    const response = await api.get('/posts', {
      params: { page, size: 10, sort: 'createdAt,desc' },
    });
    return response.data;
  },

  getPostDetail: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (title: string, content: string): Promise<Post> => {
    const response = await api.post('/posts', { title, content });
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};
