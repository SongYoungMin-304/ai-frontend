import React, { useState } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

// 모킹 데이터
const MOCK_COMMENTS: Comment[] = [];

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<{
    [commentId: number]: boolean;
  }>({});
  const [commentLoading, setCommentLoading] = useState(false);

  // 댓글 작성
  const handleCommentSubmit = async (content: string) => {
    if (!user) {
      setError('로그인 후 댓글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const newComment: Comment = {
        id: Math.max(...comments.map((c) => c.id), 0) + 1,
        postId,
        content,
        author: {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentCommentId: undefined,
        replies: [],
      };
      setComments([...comments, newComment]);
      setError(null);
    } catch (err) {
      setError('댓글 작성에 실패했습니다');
      console.error(err);
    } finally {
      setCommentLoading(false);
    }
  };

  // 대댓글 작성 (재귀)
  const handleReplySubmit = (parentCommentId: number, content: string) => {
    if (!user) {
      setError('로그인 후 답글을 작성할 수 있습니다');
      return;
    }

    try {
      const newReply: Comment = {
        id: Math.max(...comments.flatMap((c) => [c.id, ...c.replies.map((r) => r.id)]), 0) + 1,
        postId,
        content,
        author: {
          id: user.id,
          username: user.username,
          profileImage: user.profileImage,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        parentCommentId,
        replies: [],
      };

      // 재귀 함수: 깊은 위치의 대댓글 추가
      const addReplyRecursive = (
        arr: Comment[],
        parentId: number,
        reply: Comment,
      ): Comment[] => {
        return arr.map((c) => ({
          ...c,
          replies: c.id === parentId ? [...c.replies, reply] : addReplyRecursive(c.replies, parentId, reply),
        }));
      };

      setComments(addReplyRecursive(comments, parentCommentId, newReply));
      setError(null);
    } catch (err) {
      setError('답글 작성에 실패했습니다');
      console.error(err);
    }
  };

  // 댓글 삭제 (재귀)
  const handleDelete = (commentId: number) => {
    try {
      // 재귀 함수: 깊은 위치의 댓글 삭제
      const deleteCommentRecursive = (arr: Comment[], id: number): Comment[] => {
        return arr
          .filter((c) => c.id !== id)
          .map((c) => ({
            ...c,
            replies: deleteCommentRecursive(c.replies, id),
          }));
      };

      setComments(deleteCommentRecursive(comments, commentId));
      setError(null);
    } catch (err) {
      setError('댓글 삭제에 실패했습니다');
      console.error(err);
    }
  };

  const handleToggleReplyForm = (commentId: number) => {
    setShowReplyForm({
      ...showReplyForm,
      [commentId]: !showReplyForm[commentId],
    });
  };

  return (
    <div className="border-t pt-6">
      <h3 className="text-lg font-bold mb-6">댓글 ({comments.length})</h3>

      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg">{error}</div>}

      {!user ? (
        <div className="text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
          댓글을 작성하려면 로그인해주세요.
        </div>
      ) : (
        <CommentForm onSubmit={handleCommentSubmit} loading={commentLoading} />
      )}

      {loading ? (
        <div className="text-center py-8">로딩 중...</div>
      ) : (
        <CommentList
          comments={comments}
          onDelete={handleDelete}
          onReplySubmit={handleReplySubmit}
          showReplyForm={showReplyForm}
          onToggleReplyForm={handleToggleReplyForm}
        />
      )}
    </div>
  );
}
