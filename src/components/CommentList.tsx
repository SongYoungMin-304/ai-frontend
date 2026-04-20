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
    return <div className="text-gray-500 text-center py-8">댓글이 없습니다</div>;
  }

  return (
    <div>
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
