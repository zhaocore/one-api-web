import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { apiGet, type Log, type LogStatistic, type User } from '~/api/oneApi';
import PageHeader from '../components/PageHeader';
import { useResource } from '~/layout/hooks/useResource';
import StatisticalLineChartCard from './dashboard/StatisticalLineChartCard';
import StatisticalBarChart from './dashboard/StatisticalBarChart';
import UserCard from './dashboard/UserCard';
import RecentLogs from './dashboard/RecentLogs';
import { generateLineCardOption, type LineCardOption } from '~/utils/chart';

export default function DashboardPage() {
  const { data: logs, loading: logsLoading, error, reload } = useResource<Log>('/api/log/self?p=0');
  const [isLoading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<LogStatistic[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const load = () => {
    setLoading(true);
    apiGet<LogStatistic[]>('/api/user/dashboard')
      .then((data) => setStatistics(data ?? []))
      .catch(() => setStatistics([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    apiGet<User>('/api/user/self')
      .then(setUser)
      .catch(() => undefined);
  }, []);

  const requestChart: LineCardOption = generateLineCardOption(statistics, 'RequestCount');
  const quotaChart: LineCardOption = generateLineCardOption(statistics, 'Quota');
  const tokenChart: LineCardOption = generateLineCardOption(statistics, 'PromptTokens');

  return (
    <>
      <PageHeader
        title="早上好"
        description="这是你的 API 服务运行概览。"
        action={
          <Button variant="outline" onClick={load}>
            <RefreshCw className="size-4" />
            刷新数据
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,.8fr)_minmax(0,.8fr)]">
        <StatisticalLineChartCard title="今日请求量" chartData={requestChart} isLoading={isLoading} emphasis="primary" />
        <StatisticalLineChartCard title="今日消费" chartData={quotaChart} isLoading={isLoading} emphasis="secondary" />
        <StatisticalLineChartCard title="今日 Token" chartData={tokenChart} isLoading={isLoading} emphasis="secondary" />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(18rem,.8fr)]">
        <StatisticalBarChart statistics={statistics} isLoading={isLoading} />
        <UserCard user={user} />
      </div>
      <RecentLogs logs={logs} loading={logsLoading} error={error} reload={reload} />
    </>
  );
}
