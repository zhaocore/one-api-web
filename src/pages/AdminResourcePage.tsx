import { RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import { useResource } from '~/layout/hooks/useResource';
type Resource = 'users' | 'redemptions' | 'settings';

const paths: Record<Resource, string> = { users: '/api/user?p=0', redemptions: '/api/redemption?p=0', settings: '/api/option/' };
export default function AdminResourcePage({ resource, title, description }: { resource: Resource; title: string; description: string }) {
  const { data, loading, error, reload } = useResource<Record<string, string | number>[]>(paths[resource]);
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <Button variant="outline" onClick={reload}>
            <RefreshCw className="size-4" />
            刷新
          </Button>
        }
      />
      {error ? (
        <EmptyState error={error} label={title} reload={reload} />
      ) : (
        <TableShell loading={loading}>
          {data.length ? (
            <pre className="max-h-[600px] overflow-auto p-5 text-xs">{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <EmptyState error="" label={title} reload={reload} />
          )}
        </TableShell>
      )}
    </>
  );
}
