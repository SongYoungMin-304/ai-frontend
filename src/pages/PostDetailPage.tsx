import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postService } from '../services/postService';
import { Post } from '../types';
import './PostDetailPage.css';

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
    return <div className="post-detail-page">로딩 중...</div>;
  }

  if (error || !post) {
    return (
      <div className="post-detail-page">
        <div className="post-detail-container">
          <div className="error-message">{error || '게시글을 찾을 수 없습니다'}</div>
          <button onClick={() => navigate('/')} className="back-btn">
            뒤로가기
          </button>
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

  return (
    <div className="post-detail-page">
      <div className="post-detail-container">
        <button onClick={() => navigate('/')} className="back-btn">
          ← 목록으로
        </button>

        <article className="post-detail">
          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <div className="author-info">
              <Link to={`/users/${post.author.id}`} className="author-name">
                {post.author.username}
              </Link>
              <span className="date">{formatDate(post.createdAt)}</span>
            </div>
            <div className="post-stats">
              <span className="view-count">조회 {post.viewCount}</span>
              <span className="comment-count">댓글 {post.commentCount}</span>
            </div>
          </div>

          <div className="post-content">
            {post.content.split('\n').map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>

          {post.createdAt !== post.updatedAt && (
            <div className="post-updated">
              수정됨: {formatDate(post.updatedAt)}
            </div>
          )}
        </article>

        <button onClick={() => navigate('/')} className="back-btn">
          ← 목록으로
        </button>
      </div>
    </div>
  );
};

export default PostDetailPage;
