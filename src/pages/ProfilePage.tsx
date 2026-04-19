import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../types';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userId = parseInt(id || '0');
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError('사용자를 불러올 수 없습니다');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-gray-100 py-8">로딩 중...</div>;
  }

  if (error || !user) {
    return <div className="min-h-screen bg-gray-100 py-8"><div className="max-w-2xl mx-auto px-4 bg-red-100 text-red-800 p-4 rounded text-center">{error || '사용자를 찾을 수 없습니다'}</div></div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-8 bg-white rounded-lg p-8 mb-8">
          <div className="flex-shrink-0">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} className="w-32 h-32 rounded-full object-cover" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">{user.username[0]?.toUpperCase()}</div>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h1 className="m-0 mb-2 text-gray-800">{user.username}</h1>
            <p className="my-2 text-gray-600">{user.email}</p>
            <p className="my-4 text-gray-600 leading-relaxed">{user.bio || '자기소개가 없습니다'}</p>
            <p className="my-2 text-gray-400 text-sm">가입일: {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="flex gap-8 bg-white rounded-lg p-8">
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="text-4xl font-bold text-blue-600">{user.postCount}</span>
            <span className="mt-2 text-gray-600 text-sm">게시물</span>
          </div>
          <div className="flex-1 flex flex-col items-center text-center">
            <span className="text-4xl font-bold text-blue-600">{user.commentCount}</span>
            <span className="mt-2 text-gray-600 text-sm">댓글</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
