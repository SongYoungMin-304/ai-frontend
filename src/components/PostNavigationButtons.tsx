import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';

interface PostNavigationButtonsProps {
  currentPostId: number;
}

interface NeighborPost {
  id: number;
  title: string;
}

interface NeighborsData {
  previousPost: NeighborPost | null;
  nextPost: NeighborPost | null;
}

const PostNavigationButtons: React.FC<PostNavigationButtonsProps> = ({ currentPostId }) => {
  const navigate = useNavigate();
  const [neighbors, setNeighbors] = useState<NeighborsData>({
    previousPost: null,
    nextPost: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postService.getNeighborPosts(currentPostId);
        if (response.success && response.data) {
          setNeighbors(response.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch neighbor posts:', err);
        setError('네비게이션 정보를 불러올 수 없습니다');
      } finally {
        setLoading(false);
      }
    };

    fetchNeighbors();
  }, [currentPostId]);

  const handleNavigate = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-between gap-4 mt-8">
        <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
        <div className="flex-1 h-12 bg-gray-200 rounded animate-pulse" />
      </div>
    );
  }

  const previousDisabled = !neighbors.previousPost;
  const nextDisabled = !neighbors.nextPost;

  return (
    <div className="flex justify-between gap-4 mt-8">
      <button
        onClick={() => neighbors.previousPost && handleNavigate(neighbors.previousPost.id)}
        disabled={previousDisabled}
        className={`flex-1 py-3 px-4 rounded font-medium transition-colors ${
          previousDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
        title={neighbors.previousPost?.title || '이전 게시글이 없습니다'}
      >
        <span className="truncate block text-left">
          ← {neighbors.previousPost?.title || '이전글'}
        </span>
      </button>

      <button
        onClick={() => neighbors.nextPost && handleNavigate(neighbors.nextPost.id)}
        disabled={nextDisabled}
        className={`flex-1 py-3 px-4 rounded font-medium transition-colors ${
          nextDisabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'
            : 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
        }`}
        title={neighbors.nextPost?.title || '다음 게시글이 없습니다'}
      >
        <span className="truncate block text-right">
          {neighbors.nextPost?.title || '다음글'} →
        </span>
      </button>
    </div>
  );
};

export default PostNavigationButtons;
