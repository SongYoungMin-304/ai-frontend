import React, { useState, useEffect } from 'react';
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
        const token = localStorage.getItem('accessToken');
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`/api/v1/posts/${postId}/comments`, { headers });
        if (!response.ok) throw new Error('댓글을 불러올 수 없습니다');
        const data = await response.json();
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

  // 댓글 작성
  const handleCommentSubmit = async (content: string) => {
    if (!user) {
      setError('로그인 후 댓글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/v1/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('댓글 작성에 실패했습니다');
      const newComment = await response.json();
      setComments([...comments, newComment]);
      setError(null);
    } catch (err: any) {
      setError(err.message || '댓글 작성에 실패했습니다');
    } finally {
      setCommentLoading(false);
    }
  };

  // 대댓글 작성 (재귀)
  const handleReplySubmit = async (parentCommentId: number, content: string) => {
    if (!user) {
      setError('로그인 후 답글을 작성할 수 있습니다');
      return;
    }

    setCommentLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/v1/comments/${parentCommentId}/replies`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('답글 작성에 실패했습니다');
      const newReply = await response.json();

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
      const token = localStorage.getItem('accessToken');
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });
      if (!response.ok) throw new Error('댓글 삭제에 실패했습니다');

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
