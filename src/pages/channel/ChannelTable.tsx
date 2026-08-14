import { useState } from 'react';
import { Edit, Gauge, Trash2 } from 'lucide-react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import {
  CHANNEL_OPTIONS,
  Channel,
  apiDelete,
  apiGet,
  apiPut,
  formatTime,
  renderNumber,
  renderQuota,
} from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';

interface ChannelTableProps {
  rows: Channel[];
  loading: boolean;
  reload: () => Promise<void>;
  onEdit: (channel: Channel) => void;
}

export default function ChannelTable({ rows, loading, reload, onEdit }: ChannelTableProps) {
  const { showToast } = useToastContext();
  const [busyId, setBusyId] = useState<number | null>(null);

  const run = async (id: number, action: () => Promise<void>, successMessage: string) => {
    setBusyId(id);
    try {
      await action();
      showToast({ message: successMessage, severity: NotificationSeverity.SUCCESS });
      await reload();
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '操作失败', severity: NotificationSeverity.ERROR });
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = (channel: Channel) => {
    if (!window.confirm(`确定删除渠道「${channel.name || `#${channel.id}`}」？`)) return;
    void run(channel.id, () => apiDelete(`/api/channel/${channel.id}`), '渠道已删除');
  };

  const handleToggle = (channel: Channel) => {
    const next = channel.status === 1 ? 2 : 1;
    void run(channel.id, () => apiPut('/api/channel/', { id: channel.id, status: next }), next === 1 ? '渠道已启用' : '渠道已禁用');
  };

  const handleTest = (channel: Channel) => {
    void run(
      channel.id,
      async () => {
        const data = await apiGet<{ time: number }>(`/api/channel/test/${channel.id}`);
        showToast({
          message: `渠道「${channel.name}」测试通过，耗时 ${data.time.toFixed(2)} 秒`,
          severity: NotificationSeverity.SUCCESS,
        });
      },
      '测试完成',
    );
  };

  const handlePriority = (channel: Channel, value: string) => {
    const priority = parseInt(value, 10);
    if (Number.isNaN(priority) || priority === channel.priority) return;
    void run(channel.id, () => apiPut('/api/channel/', { id: channel.id, priority }), '优先级已更新');
  };

  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">名称</th>
            <th className="px-4 py-3 font-medium">分组</th>
            <th className="px-4 py-3 font-medium">类型</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">响应时间</th>
            <th className="px-4 py-3 font-medium">已消耗</th>
            <th className="px-4 py-3 font-medium">余额</th>
            <th className="px-4 py-3 font-medium">优先级</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-400">{item.id}</td>
              <td className="px-4 py-3">
                <b>{item.name || `渠道 #${item.id}`}</b>
                <small className="block max-w-40 truncate text-slate-400">{item.models || '—'}</small>
              </td>
              <td className="px-4 py-3">{item.group || 'default'}</td>
              <td className="px-4 py-3">{CHANNEL_OPTIONS[item.type] ?? `类型 ${item.type}`}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.status === 1}
                    disabled={busyId === item.id}
                    aria-label={`切换渠道 ${item.id} 状态`}
                    onCheckedChange={() => handleToggle(item)}
                  />
                  <StatusBadge value={item.status} />
                </div>
              </td>
              <td className="px-4 py-3">
                {item.response_time ? (
                  <div>
                    <span>{item.response_time} ms</span>
                    {item.test_time ? <small className="block text-slate-400">{formatTime(item.test_time)}</small> : null}
                  </div>
                ) : (
                  '未测试'
                )}
              </td>
              <td className="px-4 py-3">{renderNumber(item.used_quota)}</td>
              <td className="px-4 py-3">{renderQuota(item.balance)}</td>
              <td className="px-4 py-3">
                <input
                  type="number"
                  min={0}
                  defaultValue={item.priority}
                  disabled={busyId === item.id}
                  className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:border-teal-700 dark:border-slate-700 dark:bg-slate-900"
                  onBlur={(event) => handlePriority(item, event.target.value)}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label="编辑渠道" onClick={() => onEdit(item)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="测试渠道" disabled={busyId === item.id} onClick={() => handleTest(item)}>
                    <Gauge className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="删除渠道" disabled={busyId === item.id} onClick={() => handleDelete(item)}>
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length && <EmptyState error="" label="渠道" reload={reload} />}
    </TableShell>
  );
}
