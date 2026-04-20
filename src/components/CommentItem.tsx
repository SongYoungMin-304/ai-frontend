import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: number) => void;
  onReplySubmit: (parentCommentId: number, content: string) => void;
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
  const createdDate = new Date(comment.createdAt).toLocaleDateString('ko-KR');

  const handleReplySubmit = async (content: string) => {
    setReplyLoading(true);
    try {
      onReplySubmit(comment.id, content);
      onToggleReplyForm(comment.id);
    } finally {
      setReplyLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        {comment.author.profileImage && (
          <img
            src={comment.author.profileImage}
            alt={comment.author.username}
            className="w-8 h-8 rounded-full bg-gray-300"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{comment.author.username}</span>
            <span className="text-xs text-gray-500">{createdDate}</span>
          </div>
        </div>
        {isAuthor && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-xs text-red-500 hover:text-red-700"
          >
            삭제
          </button>
        )}
      </div>

      {/* 본문 */}
      <p className="text-gray-800 mb-3">{comment.content}</p>

      {/* 액션 버튼 */}
      {!showReplyForm[comment.id] && (
        <button
          onClick={() => onToggleReplyForm(comment.id)}
          className="text-xs text-gray-600 hover:text-gray-900 font-medium"
        >
          답글
        </button>
      )}

      {/* 답글 폼 */}
      {showReplyForm[comment.id] && (
        <CommentForm
          onSubmit={handleReplySubmit}
          loading={replyLoading}
          isReply={true}
          onCancel={() => onToggleReplyForm(comment.id)}
        />
      )}

      {/* 대댓글 (재귀) */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 border-l border-gray-300 pl-4 mt-4">
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
      )}
    </div>
  );
}
