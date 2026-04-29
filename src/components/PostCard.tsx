import React from 'react';
import { Link } from 'react-router-dom';
import { Post, CategoryLabels } from '../types';
import PostLikeButton from './PostLikeButton';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const initial = post.author.username.charAt(0).toUpperCase();

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-ink-200/70 bg-white p-6 shadow-card transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-card-lift">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-200 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-100 to-accent-200 text-[11px] font-bold text-accent-700">
          {initial}
        </span>
        <span className="text-sm font-semibold text-ink-700">
          {post.author.username}
        </span>
        <span className="text-ink-300">·</span>
        <span className="text-xs font-medium text-ink-400">
          {formatDate(post.createdAt)}
        </span>
        {post.category && (
          <>
            <span className="text-ink-300">·</span>
            <span className="rounded-full bg-accent-50 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
              {CategoryLabels[post.category]}
            </span>
          </>
        )}
      </div>

      <Link to={`/posts/${post.id}`} className="block">
        <h3 className="mb-2 break-words text-[19px] font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-200 group-hover:text-accent-700">
          {post.title}
        </h3>
      </Link>

      <div className="mt-4 flex items-center gap-5 border-t border-ink-100 pt-4">
        <span className="meta-chip">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
            <circle cx="10" cy="10" r="2.5" />
          </svg>
          {post.viewCount}
        </span>
        <span className="meta-chip">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3v-3H5a2 2 0 0 1-2-2V5z" />
          </svg>
          {post.commentCount}
        </span>
        <div className="ml-auto">
          <PostLikeButton
            postId={post.id}
            initialLikeCount={post.likeCount || 0}
            initialLiked={post.liked || false}
          />
        </div>
      </div>
    </article>
  );
};

export default PostCard;
