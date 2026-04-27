import React, { useState, useEffect } from 'react';
import { Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { commentService } from '../services/commentService';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

// 모킹 데이터
const MOCK_COMMENTS: Comment[] = [];

interface CommentSectionProps {
  postId: number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReplyForm, setShowReplyForm] = useState<{
    [commentId: number]: boolean;
  }>({});
  const [commentLoading, setCommentLoading] = useState(false);

  // API에서 댓글 로드
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getComments(postId);
        setComments(data.comments);
        setError(null);
      } catch (err: any) {
        setError(err.message || '댓글을 불러올 수 없습니다');
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (content: string, image?: File | null) => {
    if (!user) {
      setError('로그인 후 댓글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const newComment = await commentService.createComment(postId, content, image);
      setComments([...comments, newComment]);
      setError(null);
    } catch (err: any) {
      setError(err.message || '댓글 작성에 실패했습니다');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleReplySubmit = async (parentCommentId: number, content: string, image?: File | null) => {
    if (!user) {
      setError('로그인 후 답글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const newReply = await commentService.createReply(parentCommentId, content, image);

      // 재귀 함수: 깊은 위치의 대댓글 추가
      const addReplyRecursive = (arr: Comment[], parentId: number, reply: Comment): Comment[] => {
        return arr.map((c) => ({
          ...c,
          replies: c.id === parentId ? [...c.replies, reply] : addReplyRecursive(c.replies, parentId, reply),
        }));
      };

      setComments(addReplyRecursive(comments, parentCommentId, newReply));
      setError(null);
      setShowReplyForm({ ...showReplyForm, [parentCommentId]: false });
    } catch (err: any) {
      setError(err.message || '답글 작성에 실패했습니다');
    } finally {
      setCommentLoading(false);
    }
  };

  // 댓글 삭제 (재귀)
  const handleDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);

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
    } catch (err: any) {
      setError(err.message || '댓글 삭제에 실패했습니다');
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
