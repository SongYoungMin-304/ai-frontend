import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post, PostsResponse } from '../types';
import PostCard from '../components/PostCard';

const MainPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response: PostsResponse = await postService.getPosts(page);
        setPosts(response.content);
        setTotalPages(response.totalPages);
      } catch (err: any) {
        setError('게시글을 불러올 수 없습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-10 animate-fade-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
            Community Board
          </p>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                오늘의 이야기
              </h1>
              <p className="mt-2 text-[15px] text-ink-500">
                생각을 나누고, 함께 자라는 공간.
              </p>
            </div>
            {isAuthenticated && (
              <Link to="/posts/create" className="btn-primary shrink-0">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="M10 4v12M4 10h12" />
                </svg>
                글쓰기
              </Link>
            )}
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-800">
            {error}
          </div>
        )}

        {loading && posts.length === 0 ? (
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-36 animate-pulse rounded-2xl border border-ink-200/70 bg-white"
              />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="card flex flex-col items-center justify-center px-6 py-20 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-100 text-ink-400">
              <svg
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8l-4 4V6z" />
              </svg>
            </div>
            <p className="text-base font-medium text-ink-700">아직 게시글이 없어요</p>
            <p className="mt-1 text-sm text-ink-400">
              첫 번째 이야기의 주인공이 되어보세요.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {posts.map((post, idx) => (
                <div
                  key={post.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${Math.min(idx, 6) * 60}ms` }}
                >
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-all duration-150 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                  aria-label="이전 페이지"
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
                </button>
                <div className="flex items-center gap-1 px-3 text-sm font-medium text-ink-600">
                  <span className="font-display text-base font-semibold text-ink-900">
                    {page + 1}
                  </span>
                  <span className="text-ink-300">/</span>
                  <span>{totalPages}</span>
                </div>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-ink-200 bg-white text-ink-600 transition-all duration-150 hover:border-ink-300 hover:bg-ink-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                  aria-label="다음 페이지"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M8 5l5 5-5 5" />
                  </svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
