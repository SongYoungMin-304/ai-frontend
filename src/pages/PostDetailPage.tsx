import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import CommentSection from '../components/CommentSection';
import PostLikeButton from '../components/PostLikeButton';
import PostNavigationButtons from '../components/PostNavigationButtons';

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const postId = parseInt(id || '0');
        const postData = await postService.getPostDetail(postId);
        setPost(postData);
      } catch (err: any) {
        setError('게시글을 불러올 수 없습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="card animate-pulse p-10">
            <div className="mb-6 h-8 w-2/3 rounded-lg bg-ink-100" />
            <div className="mb-2 h-4 w-1/3 rounded bg-ink-100" />
            <div className="mt-8 space-y-3">
              <div className="h-3 w-full rounded bg-ink-100" />
              <div className="h-3 w-11/12 rounded bg-ink-100" />
              <div className="h-3 w-3/4 rounded bg-ink-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-10">
        <div className="mx-auto max-w-3xl px-6">
          <div className="card flex flex-col items-center px-6 py-16 text-center">
            <p className="text-base font-medium text-ink-700">
              {error || '게시글을 찾을 수 없습니다'}
            </p>
            <button onClick={() => navigate('/')} className="btn-secondary mt-6">
              ← 목록으로
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const initial = post.author.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pb-24 pt-8">
      <div className="mx-auto max-w-3xl px-6">
        <button
          onClick={() => navigate('/')}
          className="mb-6 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M12 5l-5 5 5 5" />
          </svg>
          목록으로
        </button>

        <article className="card animate-fade-up overflow-hidden p-8 sm:p-12">
          <h1 className="font-display text-[34px] font-semibold leading-[1.15] tracking-tight text-ink-900 sm:text-[42px]">
            {post.title}
          </h1>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink-100 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-100 to-accent-200 text-sm font-bold text-accent-700">
                {initial}
              </span>
              <div className="flex flex-col leading-tight">
                <Link
                  to={`/users/${post.author.id}`}
                  className="text-sm font-semibold text-ink-900 transition-colors hover:text-accent-700"
                >
                  {post.author.username}
                </Link>
                <span className="text-xs text-ink-400">
                  {formatDate(post.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-5">
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
                조회 {post.viewCount}
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
                댓글 {post.commentCount}
              </span>
              <PostLikeButton
                postId={post.id}
                initialLikeCount={post.likeCount || 0}
                initialLiked={post.liked || false}
              />
            </div>
          </div>

          <div className="mt-8 whitespace-pre-wrap break-words text-[17px] leading-[1.8] text-ink-800">
            {post.content.split('\n').map((line, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {line || '\u00A0'}
              </p>
            ))}
          </div>

          {post.imageUrl && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-ink-200/70">
              <img
                src={`http://localhost:8080/uploads/${post.imageUrl}`}
                alt="첨부 이미지"
                className="h-auto w-full"
              />
            </div>
          )}

          {post.createdAt !== post.updatedAt && (
            <div className="mt-10 border-t border-ink-100 pt-4 text-xs font-medium text-ink-400">
              마지막 수정: {formatDate(post.updatedAt)}
            </div>
          )}
        </article>

        <div className="card mt-8 p-8 sm:p-10">
          <CommentSection postId={post.id} />
        </div>

        <PostNavigationButtons currentPostId={post.id} />

        <button
          onClick={() => navigate('/')}
          className="btn-secondary mt-8 w-full sm:w-auto"
        >
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;
