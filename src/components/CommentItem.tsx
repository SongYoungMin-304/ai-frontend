import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';
import CommentLikeButton from './CommentLikeButton';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => Promise<void>;
  onReplySubmit: (
    parentCommentId: number,
    content: string,
    image?: File | null,
  ) => Promise<void>;
  showReplyForm: { [commentId: number]: boolean };
  onToggleReplyForm: (commentId: number) => void;
}

export default function CommentItem({
  comment,
  onDelete,
  onReplySubmit,
  showReplyForm,
  onToggleReplyForm,
}: CommentItemProps) {
  const { user } = useAuth();
  const [replyLoading, setReplyLoading] = useState(false);

  const isAuthor = user?.id === comment.author.id;
  const created = new Date(comment.createdAt);
  const now = new Date();
  const diffMin = Math.floor((now.getTime() - created.getTime()) / 60000);
  const relativeDate =
    diffMin < 1
      ? '방금 전'
      : diffMin < 60
        ? `${diffMin}분 전`
        : diffMin < 1440
          ? `${Math.floor(diffMin / 60)}시간 전`
          : created.toLocaleDateString('ko-KR');

  const handleReplySubmit = async (content: string, image?: File | null) => {
    setReplyLoading(true);
    try {
      await onReplySubmit(comment.id, content, image);
      onToggleReplyForm(comment.id);
    } finally {
      setReplyLoading(false);
    }
  };

  const initial = comment.author.username.charAt(0).toUpperCase();

  return (
    <div className="py-5">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent-100 to-accent-200 text-xs font-bold text-accent-700">
          {comment.author.profileImage ? (
            <img
              src={comment.author.profileImage}
              alt={comment.author.username}
              className="h-full w-full object-cover"
            />
          ) : (
            initial
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-900">
              {comment.author.username}
            </span>
            {comment.author.isMasterAccount && (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                👑 마스터
              </span>
            )}
            <span className="text-ink-300">·</span>
            <span className="text-xs font-medium text-ink-400">{relativeDate}</span>
            {isAuthor && (
              <button
                onClick={() => onDelete(comment.id)}
                className="ml-auto text-xs font-medium text-ink-400 transition-colors hover:text-rose-600"
              >
                삭제
              </button>
            )}
          </div>

          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-ink-800">
            {comment.content}
          </p>

          {comment.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-ink-200/70">
              <img
                src={`http://localhost:8080/uploads/${comment.imageUrl}`}
                alt="첨부 이미지"
                className="max-w-sm"
              />
            </div>
          )}

          {!showReplyForm[comment.id] && (
            <div className="mt-3 flex items-center gap-1">
              <CommentLikeButton
                commentId={comment.id}
                initialLikeCount={comment.likeCount || 0}
                initialLiked={comment.liked || false}
              />
              <button
                onClick={() => onToggleReplyForm(comment.id)}
                className="rounded-lg px-2.5 py-1 text-xs font-semibold text-ink-500 transition-colors duration-150 hover:bg-ink-100 hover:text-ink-900"
              >
                답글 달기
              </button>
            </div>
          )}

          {showReplyForm[comment.id] && (
            <div className="mt-3">
              <CommentForm
                onSubmit={handleReplySubmit}
                loading={replyLoading}
                isReply={true}
                onCancel={() => onToggleReplyForm(comment.id)}
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="relative mt-3 pl-12">
          <span
            aria-hidden="true"
            className="absolute left-[18px] top-0 h-full w-px bg-gradient-to-b from-ink-200 via-ink-200 to-transparent"
          />
          <div className="divide-y divide-ink-100">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onDelete={onDelete}
                onReplySubmit={onReplySubmit}
                showReplyForm={showReplyForm}
                onToggleReplyForm={onToggleReplyForm}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
