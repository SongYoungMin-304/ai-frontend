import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
            로그인 후 게시글을 작성할 수 있습니다.
          </div>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-2 rounded font-medium hover:bg-blue-700">
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
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="mb-8 text-gray-800">게시글 작성</h1>

        {error && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-md">
          <div className="flex flex-col mb-6">
            <label htmlFor="title" className="mb-2 font-medium text-gray-800">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="게시글 제목을 입력해주세요"
              maxLength={255}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex flex-col mb-6">
            <label htmlFor="content" className="mb-2 font-medium text-gray-800">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시글 내용을 입력해주세요"
              rows={15}
              className="px-3 py-2 border border-gray-300 rounded resize-y focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              required
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button type="submit" disabled={loading} className="flex-1 px-3 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? '작성 중...' : '게시글 작성'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-800 rounded font-medium border border-gray-300 hover:bg-gray-200"
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
