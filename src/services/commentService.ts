import api from './api';
import { Comment, CommentsResponse } from '../types';

export const commentService = {
  // 댓글 목록 조회
  getComments: async (postId: number): Promise<CommentsResponse> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  // 댓글 작성
  createComment: async (postId: number, content: string): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  // 대댓글 작성 (답글)
  createReply: async (parentCommentId: number, content: string): Promise<Comment> => {
    const response = await api.post(`/comments/${parentCommentId}/replies`, { content });
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<void> => {
    await api.delete(`/comments/${commentId}`);
  },
};
