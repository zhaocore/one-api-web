import { formatQuota, Log } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import TableShell from '../../components/TableShell';
export default function RecentLogs({ logs, loading, error, reload }: { logs: Log[]; loading: boolean; error: string; reload: () => Promise<void> }) {
  return (
    <section className="mt-9">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">请求记录</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">最近调用</h2>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">展示最新 5 条 API 请求</p>
      </div>
      {!loading && (error || logs.length === 0) ? (
        <EmptyState error={error} label="调用记录" reload={reload} />
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
