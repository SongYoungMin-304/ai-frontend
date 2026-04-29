import api from './api';
import { Post, PostsResponse, Category } from '../types';

export interface NeighborPost {
  id: number;
  title: string;
}

export interface NeighborsResponse {
  success: boolean;
  data: {
    previousPost: NeighborPost | null;
    nextPost: NeighborPost | null;
  };
}

export const postService = {
  getPosts: async (page: number = 0, category?: Category): Promise<PostsResponse> => {
    const response = await api.get('/posts', {
      params: { 
        page, 
        size: 10, 
        sort: 'createdAt,desc',
        ...(category && { category })
      },
    });
    return response.data;
  },

  getPostDetail: async (id: number): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (title: string, content: string, category?: Category, image?: File | null): Promise<Post> => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (category) {
      formData.append('category', category);
    }
    if (image) {
      formData.append('image', image);
    }
    const response = await api.post('/posts', formData);
    return response.data;
  },

  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  getNeighborPosts: async (id: number): Promise<NeighborsResponse> => {
    const response = await api.get(`/posts/${id}/neighbors`);
    return response.data;
  },
};
