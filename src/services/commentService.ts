import api from './api';
import { Comment, CommentsResponse } from '../types';

export const commentService = {
  // 댓글 목록 조회
  getComments: async (postId: number): Promise<CommentsResponse> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: number, content: string, image?: File | null): Promise<Comment> => {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    const response = await api.post(`/posts/${postId}/comments`, formData);
    return response.data;
  },

  createReply: async (parentCommentId: number, content: string, image?: File | null): Promise<Comment> => {
    const formData = new FormData();
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }
    const response = await api.post(`/comments/${parentCommentId}/replies`, formData);
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
