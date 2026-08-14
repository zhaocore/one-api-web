import { useEffect, useState } from 'react';
import { request, User } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import DeveloperAccess from './profile/DeveloperAccess';
import ProfileSummary from './profile/ProfileSummary';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    request<User>('/api/user/self', { method: 'GET' })
      .then(setUser)
      .catch((reason) => setError(reason instanceof Error ? reason.message : '无法加载账户'));
  }, []);
  if (error) return <EmptyState error={error} label="账户资料" reload={async () => window.location.reload()} />;
  return (
    <>
      <PageHeader title="账户设置" description="管理个人资料、安全凭据和额度信息。" />
      <div className="grid gap-6 xl:grid-cols-[1fr_.8fr]">
        <ProfileSummary user={user} onUpdated={setUser} />
        <DeveloperAccess />
      </div>
    </>
  );
}
