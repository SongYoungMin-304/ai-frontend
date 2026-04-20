import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface PostLikeButtonProps {
  postId: number;
  initialLikeCount?: number;
  initialLiked?: boolean;
  onLikeChange?: (likeCount: number, liked: boolean) => void;
}

export default function PostLikeButton({
  postId,
  initialLikeCount = 0,
  initialLiked = false,
  onLikeChange,
}: PostLikeButtonProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikeClick = async () => {
    if (!user) {
      alert('로그인이 필요합니다');
      return;
    }

    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLoading(true);

    try {
      if (isLiked) {
        const response = await api.delete(`/posts/${postId}/likes`);
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
        onLikeChange?.(response.data.likeCount, response.data.liked);
      } else {
        const response = await api.post(`/posts/${postId}/likes`);
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
        onLikeChange?.(response.data.likeCount, response.data.liked);
      }
    } catch (error: any) {
      console.error('좋아요 처리 중 오류:', error);
      console.error('에러 응답:', error.response?.data);
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
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
      className={`inline-flex items-center gap-1 text-sm font-medium transition-colors ${
        isLiked
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-600 hover:text-gray-900'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <span className="text-lg">{isLiked ? '❤️' : '🤍'}</span>
      <span>{likeCount}</span>
    </button>
  );
}
