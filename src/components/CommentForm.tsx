import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
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

    onSubmit(content);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className={isReply ? 'ml-12 mt-2 mb-4' : 'mb-6'}>
      <div className="flex flex-col gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={isReply ? '답글을 입력해주세요' : '댓글을 입력해주세요'}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={isReply ? 2 : 3}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      <div className="flex gap-2 mt-2 justify-end">
        {isReply && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? '작성 중...' : isReply ? '답글 작성' : '댓글 작성'}
        </button>
      </div>
    </form>
  );
}
