import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Post, PostsResponse } from '../types';
import PostCard from '../components/PostCard';
import './MainPage.css';

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
    return <div className="main-page">로딩 중...</div>;
  }

  return (
    <div className="main-page">
      <div className="main-container">
        <div className="main-header">
          <h1>게시글</h1>
          {isAuthenticated && (
            <Link to="/posts/create" className="create-post-btn">
              게시글 작성
            </Link>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

        {posts.length === 0 ? (
          <div className="empty-state">
            <p>게시글이 없습니다</p>
          </div>
        ) : (
          <>
            <div className="posts-list">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="pagination-btn"
                >
                  이전
                </button>
                <span className="page-info">
                  {page + 1} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="pagination-btn"
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
