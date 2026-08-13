import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { Log, request } from '~/api/oneApi';
import PageHeader from '../components/PageHeader';
import { useResource } from '~/layout/hooks/useResource';
import DashboardStats from './dashboard/DashboardStats';
import QuickStart from './dashboard/QuickStart';
import RecentLogs from './dashboard/RecentLogs';
import UsageTrend from './dashboard/UsageTrend';

export default function DashboardPage() {
  const { data: logs, loading, error, reload } = useResource<Log>('/api/log/self?p=0');
  const [quota, setQuota] = useState(0);
  useEffect(() => {
    request<{ quota: number }>('/api/log/self/stat', { method: 'GET' })
      .then((data) => setQuota(data.quota))
      .catch(() => undefined);
  }, []);
  return (
    <>
      <PageHeader
        title="早上好"
        description="这是你的 API 服务运行概览。"
        action={
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="size-4" />
            刷新数据
          </Button>
        }
      />
      <DashboardStats quota={quota} logCount={logs.length} />
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
        <UsageTrend />
        <QuickStart />
      </div>
      <RecentLogs logs={logs} loading={loading} error={error} reload={reload} />
    </>
  );
}
