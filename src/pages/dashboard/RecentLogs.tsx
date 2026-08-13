import { formatQuota, Log } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import PageHeader from '../../components/PageHeader';
import TableShell from '../../components/TableShell';
export default function RecentLogs({ logs, loading, error, reload }: { logs: Log[]; loading: boolean; error: string; reload: () => Promise<void> }) {
  return (
    <section className="mt-7">
      <PageHeader title="最近调用" description="最新 API 请求记录。" />
      {!loading && !error && logs.length === 0 ? (
        <EmptyState error="" label="调用记录" reload={reload} />
      ) : (
        <TableShell loading={loading}>
          <table className="w-full text-left text-sm">
            <thead>
              <tr>
                <th>模型</th>
                <th>令牌</th>
                <th>用量</th>
              </tr>
            </thead>
            <tbody>
              {logs.slice(0, 5).map((log) => (
                <tr key={log.id}>
                  <td>{log.model_name}</td>
                  <td>{log.token_name || '—'}</td>
                  <td>{formatQuota(log.quota)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableShell>
      )}
    </section>
  );
}
