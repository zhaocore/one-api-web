import { useMemo, useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { Channel } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SearchToolbar from '../components/SearchToolbar';
import { useResource } from '~/layout/hooks/useResource';
import ChannelDialog from './channel/ChannelDialog';
import ChannelTable from './channel/ChannelTable';

export default function ChannelsPage() {
  const { data, loading, error, reload } = useResource<Channel>('/api/channel?p=0');
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => data.filter((item) => `${item.id}${item.name}${item.models}`.includes(filter)), [data, filter]);

  return (
    <>
      <PageHeader
        title="渠道管理"
        description="配置模型供应商、分组和路由优先级。"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            添加渠道
          </Button>
        }
      />
      <SearchToolbar onSearch={setFilter}>
        <Button variant="outline" onClick={reload}>
          <RefreshCw className="size-4" />
          刷新
        </Button>
      </SearchToolbar>
      {error ? <EmptyState error={error} label="渠道" reload={reload} /> : <ChannelTable rows={rows} loading={loading} reload={reload} />}
      <ChannelDialog open={open} onOpenChange={setOpen} onDone={reload} />
    </>
  );
}
