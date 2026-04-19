import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import './CreatePostPage.css';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="create-post-page">
        <div className="create-post-container">
          <div className="error-message">
            로그인 후 게시글을 작성할 수 있습니다.
          </div>
          <button onClick={() => navigate('/login')} className="login-btn">
            로그인하기
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }

    try {
      setLoading(true);
      await postService.createPost(title, content);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글 작성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-page">
      <div className="create-post-container">
        <h1>게시글 작성</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력해주세요"
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시글 내용을 입력해주세요"
              rows={15}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? '작성 중...' : '게시글 작성'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="cancel-btn"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
