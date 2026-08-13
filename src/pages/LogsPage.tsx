import { useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { Log } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SearchToolbar from '../components/SearchToolbar';
import { useResource } from '~/layout/hooks/useResource';
import { LogTable } from './log/LogTable';

export default function LogsPage() {
  const { data, loading, error, reload } = useResource<Log>('/api/log/self?p=0');
  const [filter, setFilter] = useState('');
  const rows = useMemo(() => data.filter((item) => `${item.model_name}${item.token_name}${item.id}`.includes(filter)), [data, filter]);
  return (
    <>
      <PageHeader
        title="调用日志"
        description="检索和追踪每一次模型调用。"
        action={
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="size-4" />
            刷新
          </Button>
        }
      />
      <SearchToolbar onSearch={setFilter} />
      {error ? <EmptyState error={error} label="调用日志" reload={reload} /> : <LogTable logs={rows} loading={loading} reload={reload} />}
    </>
  );
}
