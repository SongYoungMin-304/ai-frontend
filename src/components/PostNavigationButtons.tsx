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

const PostNavigationButtons: React.FC<PostNavigationButtonsProps> = ({
  currentPostId,
}) => {
  const navigate = useNavigate();
  const [neighbors, setNeighbors] = useState<NeighborsData>({
    previousPost: null,
    nextPost: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNeighbors = async () => {
      try {
        setLoading(true);
        const response = await postService.getNeighborPosts(currentPostId);
        if (response.success && response.data) {
          setNeighbors(response.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch neighbor posts:', err);
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
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <div className="h-20 animate-pulse rounded-2xl border border-ink-200/70 bg-white" />
        <div className="h-20 animate-pulse rounded-2xl border border-ink-200/70 bg-white" />
      </div>
    );
  }

  const previousDisabled = !neighbors.previousPost;
  const nextDisabled = !neighbors.nextPost;

  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      <button
        onClick={() =>
          neighbors.previousPost && handleNavigate(neighbors.previousPost.id)
        }
        disabled={previousDisabled}
        className="group flex flex-col items-start gap-1 rounded-2xl border border-ink-200/70 bg-white p-4 text-left transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        title={neighbors.previousPost?.title || '이전 게시글이 없습니다'}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 transition-colors group-enabled:group-hover:text-accent-600">
          ← 이전 글
        </span>
        <span className="line-clamp-2 text-sm font-semibold text-ink-800">
          {neighbors.previousPost?.title || '이전 게시글이 없습니다'}
        </span>
      </button>

      <button
        onClick={() => neighbors.nextPost && handleNavigate(neighbors.nextPost.id)}
        disabled={nextDisabled}
        className="group flex flex-col items-end gap-1 rounded-2xl border border-ink-200/70 bg-white p-4 text-right transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        title={neighbors.nextPost?.title || '다음 게시글이 없습니다'}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-ink-400 transition-colors group-enabled:group-hover:text-accent-600">
          다음 글 →
        </span>
        <span className="line-clamp-2 text-sm font-semibold text-ink-800">
          {neighbors.nextPost?.title || '다음 게시글이 없습니다'}
        </span>
      </button>
    </div>
  );
};

export default PostNavigationButtons;
