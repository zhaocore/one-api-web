import { MoreHorizontal } from 'lucide-react';
import { Button } from '@librechat/client';
import { Channel } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';

export default function ChannelTable({ rows, loading, reload }: { rows: Channel[]; loading: boolean; reload: () => Promise<void> }) {
  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>渠道</th>
            <th>状态</th>
            <th>分组</th>
            <th>模型</th>
            <th>响应时间</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.name || `渠道 #${item.id}`}</b>
                <small className="block text-slate-400">
                  ID {item.id} · 类型 {item.type}
                </small>
              </td>
              <td>
                <StatusBadge value={item.status} />
              </td>
              <td>{item.group || 'default'}</td>
              <td>{item.models || '—'}</td>
              <td>{item.response_time ? `${item.response_time} ms` : '未测试'}</td>
              <td>
                <Button variant="ghost" size="icon" aria-label="编辑渠道">
                  <MoreHorizontal />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length && <EmptyState error="" label="渠道" reload={reload} />}
    </TableShell>
  );
}
