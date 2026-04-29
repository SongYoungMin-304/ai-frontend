import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

interface CommentLikeButtonProps {
  commentId: number;
  initialLikeCount?: number;
  initialLiked?: boolean;
  onLikeChange?: (likeCount: number, liked: boolean) => void;
}

export default function CommentLikeButton({
  commentId,
  initialLikeCount = 0,
  initialLiked = false,
  onLikeChange,
}: CommentLikeButtonProps) {
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
        const response = await api.delete(`/comments/${commentId}/likes`);
        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
        onLikeChange?.(response.data.likeCount, response.data.liked);
      } else {
        const response = await api.post(`/comments/${commentId}/likes`);
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
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${
        isLiked
          ? 'text-rose-600 hover:bg-rose-50'
          : 'text-ink-500 hover:bg-ink-100 hover:text-ink-900'
      }`}
      aria-pressed={isLiked}
    >
      <svg
        className={`h-3.5 w-3.5 transition-transform duration-150 ${
          isLiked ? 'scale-110 fill-rose-500' : 'fill-none'
        }`}
        viewBox="0 0 20 20"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      >
        <path d="M10 17s-6-3.6-6-8.5A3.5 3.5 0 0 1 10 6a3.5 3.5 0 0 1 6 2.5C16 13.4 10 17 10 17z" />
      </svg>
      <span className="tabular-nums">{likeCount}</span>
    </button>
  );
}
