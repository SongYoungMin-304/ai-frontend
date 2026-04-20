import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface CommentLikeButtonProps {
  commentId: number;
  initialLikeCount?: number;
  initialIsLiked?: boolean;
  onLikeChange?: (likeCount: number, isLiked: boolean) => void;
}

export default function CommentLikeButton({
  commentId,
  initialLikeCount = 0,
  initialIsLiked = false,
  onLikeChange,
}: CommentLikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    setIsLoading(true);
    try {
      if (isLiked) {
        const response = await api.delete(`/comments/${commentId}/likes`);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
        onLikeChange?.(response.data.likeCount, response.data.isLiked);
      } else {
        const response = await api.post(`/comments/${commentId}/likes`);
        setIsLiked(response.data.isLiked);
        setLikeCount(response.data.likeCount);
        onLikeChange?.(response.data.likeCount, response.data.isLiked);
      }
    } catch (error: any) {
      console.error('좋아요 처리 중 오류:', error);
      console.error('에러 응답:', error.response?.data);
      const message = error.response?.data?.message || '좋아요 처리 중 오류가 발생했습니다';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLikeClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
        isLiked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-600 hover:text-gray-900'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="text-sm">{isLiked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
}
