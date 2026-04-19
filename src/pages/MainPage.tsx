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

  if (loading && posts.length === 0) {
    return <div className="min-h-screen bg-gray-100 py-8">로딩 중...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-gray-800">게시글</h1>
          {isAuthenticated && (
            <Link to="/posts/create" className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700">
              게시글 작성
            </Link>
          )}
        </div>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>게시글이 없습니다</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-8">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-4 py-2 border border-gray-300 bg-white rounded font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  이전
                </button>
                <span className="font-medium text-gray-600 min-w-20 text-center">
                  {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="px-4 py-2 border border-gray-300 bg-white rounded font-medium hover:bg-blue-600 hover:text-white hover:border-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  다음
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainPage;
