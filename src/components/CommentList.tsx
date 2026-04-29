import React from 'react';
import { Comment } from '../types';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  onDelete: (commentId: number) => void;
  onReplySubmit: (parentCommentId: number, content: string) => void;
  showReplyForm: { [commentId: number]: boolean };
  onToggleReplyForm: (commentId: number) => void;
}

export default function CommentList({
  comments,
  onDelete,
  onReplySubmit,
  showReplyForm,
  onToggleReplyForm,
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/40 py-12 text-center">
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-400 shadow-card">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 3v-3H5a2 2 0 0 1-2-2V5z" />
          </svg>
        </span>
        <p className="text-sm font-medium text-ink-600">첫 댓글을 남겨보세요</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-ink-100">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onDelete={onDelete}
          onReplySubmit={onReplySubmit}
          showReplyForm={showReplyForm}
          onToggleReplyForm={onToggleReplyForm}
        />
      ))}
    </div>
  );
}
