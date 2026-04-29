import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string, image?: File | null) => Promise<void>;
  loading?: boolean;
  isReply?: boolean;
  onCancel?: () => void;
}

export default function CommentForm({
  onSubmit,
  loading = false,
  isReply = false,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

    if (!content.trim()) {
      setError('내용을 입력해주세요');
      return;
    }

    if (content.length > 500) {
      setError('500자 이하로 입력해주세요');
      return;
    }

    await onSubmit(content, imageFile);
    setContent('');
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit} className={isReply ? 'mb-2' : 'mb-8'}>
      <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white transition-colors duration-150 focus-within:border-accent-400 focus-within:ring-4 focus-within:ring-accent-100">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? '답글을 남겨보세요' : '따뜻한 댓글을 남겨주세요'}
          className="w-full resize-none border-0 bg-transparent px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-400 focus:outline-none"
          rows={isReply ? 2 : 3}
          disabled={loading}
        />

        {imagePreview && (
          <div className="mx-4 mb-3 overflow-hidden rounded-xl border border-ink-200">
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="max-w-xs" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-ink-900/80 text-white backdrop-blur-md transition-all hover:bg-ink-900"
                aria-label="이미지 삭제"
              >
                <svg
                  className="h-3.5 w-3.5"
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
          </div>
        )}

        <div className="flex items-center justify-between gap-2 border-t border-ink-100 bg-ink-50/40 px-3 py-2">
          {!isReply ? (
            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-ink-500 transition-colors hover:bg-white hover:text-ink-900">
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="2.5" y="2.5" width="15" height="15" rx="2" />
                <circle cx="7" cy="7" r="1.5" />
                <path d="M17.5 13l-4-4-9 8.5" />
              </svg>
              이미지
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="hidden"
              />
            </label>
          ) : (
            <span className="text-xs font-medium text-ink-400">↳ 답글 작성</span>
          )}

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-ink-400">
              {content.length}/500
            </span>
            {isReply && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-ink-500 transition-colors hover:bg-white hover:text-ink-900 disabled:opacity-50"
              >
                취소
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-ink-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-150 hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-300"
            >
              {loading ? '작성 중...' : isReply ? '답글' : '등록'}
            </button>
          </div>
        </div>
      </div>

      {error && <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>}
    </form>
  );
}
