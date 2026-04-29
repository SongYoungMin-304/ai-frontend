import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { postService } from '../services/postService';
import { Category, CategoryLabels } from '../types';

const CreatePostPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Category | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-10">
        <div className="mx-auto max-w-md px-6">
          <div className="card flex flex-col items-center px-6 py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-500">
              <svg
                className="h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              로그인이 필요해요
            </h2>
            <p className="mt-1 text-sm text-ink-500">
              로그인 후 게시글을 작성할 수 있습니다.
            </p>
            <button onClick={() => navigate('/login')} className="btn-primary mt-6">
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('이미지 파일만 업로드 가능합니다');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('이미지 크기는 10MB 이하만 가능합니다');
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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
      await postService.createPost(title, content, category, imageFile);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '게시글 작성에 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-10">
      <div className="mx-auto max-w-3xl px-6">
        <header className="mb-8 animate-fade-up">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent-600">
            New Story
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink-900">
            게시글 작성
          </h1>
          <p className="mt-2 text-sm text-ink-500">
            마음 속 이야기를 자유롭게 남겨보세요.
          </p>
        </header>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3 text-sm font-medium text-rose-800">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="10" cy="10" r="8" />
              <path d="M10 6v5M10 14h.01" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="card animate-fade-up overflow-hidden p-8 sm:p-10"
        >
          <div className="mb-6">
            <label htmlFor="category" className="label-text">
              카테고리
            </label>
            <select
              id="category"
              value={category || ''}
              onChange={(e) => setCategory(e.target.value ? e.target.value as Category : undefined)}
              className="input-field"
            >
              <option value="">카테고리 선택 (선택사항)</option>
              {Object.entries(CategoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="title" className="label-text">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="어떤 이야기를 들려주실 건가요?"
              maxLength={255}
              className="input-field text-lg font-medium"
              required
            />
            <p className="mt-1.5 text-right text-xs text-ink-400">
              {title.length} / 255
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="label-text">
              내용
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="자유롭게 적어주세요..."
              rows={14}
              className="input-field resize-y leading-relaxed"
              required
            />
          </div>

          <div className="mb-2">
            <label className="label-text">이미지 첨부</label>
            {!imagePreview ? (
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/50 px-6 py-10 text-center transition-all duration-200 hover:border-accent-300 hover:bg-accent-50/50"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-ink-500 shadow-card">
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </span>
                <span className="text-sm font-medium text-ink-700">
                  클릭하여 이미지 업로드
                </span>
                <span className="text-xs text-ink-400">PNG, JPG · 최대 10MB</span>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-xl border border-ink-200">
                <img src={imagePreview} alt="Preview" className="h-auto w-full" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/80 text-white backdrop-blur-md transition-all hover:bg-ink-900"
                  aria-label="이미지 삭제"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M5 5l10 10M15 5L5 15" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-ink-100 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-secondary sm:w-auto"
            >
              취소
            </button>
            <button type="submit" disabled={loading} className="btn-primary sm:w-auto">
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 20 20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M17 10a7 7 0 0 0-7-7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  작성 중...
                </>
              ) : (
                '게시하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;
