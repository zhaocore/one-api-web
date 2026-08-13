import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import { Token } from '~/api/oneApi';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import SearchToolbar from '../components/SearchToolbar';
import { useResource } from '~/layout/hooks/useResource';
import TokenDialog from './token/TokenDialog';
import TokenTable from './token/TokenTable';

export default function TokensPage() {
  const { data, loading, error, reload } = useResource<Token>('/api/token?p=0');
  const [open, setOpen] = useState(false);
  return (
    <>
      <PageHeader
        title="令牌管理"
        description="创建和管理调用 API 所需的访问令牌。"
        action={
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            新建令牌
          </Button>
        }
      />
      <SearchToolbar onSearch={() => undefined}>
        <Button variant="outline" onClick={reload}>
          <RefreshCw className="size-4" />
          刷新
        </Button>
      </SearchToolbar>
      {error ? <EmptyState error={error} label="令牌" reload={reload} /> : <TokenTable tokens={data} loading={loading} reload={reload} />}
      <TokenDialog open={open} onOpenChange={setOpen} onDone={reload} />
    </>
  );
}
