import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../services/userService';
import { User } from '../types';
import './ProfilePage.css';

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
    return <div className="profile-page">로딩 중...</div>;
  }

  if (error || !user) {
    return <div className="profile-page"><div className="error-message">{error || '사용자를 찾을 수 없습니다'}</div></div>;
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
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.username} />
            ) : (
              <div className="default-avatar">{user.username[0]?.toUpperCase()}</div>
            )}
          </div>

          <div className="profile-info">
            <h1>{user.username}</h1>
            <p className="email">{user.email}</p>
            <p className="bio">{user.bio || '자기소개가 없습니다'}</p>
            <p className="join-date">가입일: {formatDate(user.createdAt)}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat">
            <span className="stat-value">{user.postCount}</span>
            <span className="stat-label">게시물</span>
          </div>
          <div className="stat">
            <span className="stat-value">{user.commentCount}</span>
            <span className="stat-label">댓글</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
