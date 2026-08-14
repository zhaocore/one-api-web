import { useState } from 'react';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { REDEMPTION_STATUS, Redemption, apiDelete, apiPut, copyText, formatQuota, formatTime } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import TableShell from '../../components/TableShell';

interface RedemptionTableProps {
  rows: Redemption[];
  loading: boolean;
  reload: () => Promise<void>;
  onEdit: (item: Redemption) => void;
}

export default function RedemptionTable({ rows, loading, reload, onEdit }: RedemptionTableProps) {
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

  const handleToggle = (item: Redemption) => {
    const next = item.status === 1 ? 2 : 1;
    void run(item.id, () => apiPut('/api/redemption/?status_only=true', { id: item.id, status: next }), next === 1 ? '兑换码已启用' : '兑换码已禁用');
  };

  const handleDelete = (item: Redemption) => {
    if (!window.confirm(`确定删除兑换码「${item.name}」？`)) return;
    void run(item.id, () => apiDelete(`/api/redemption/${item.id}`), '兑换码已删除');
  };

  const handleCopy = (item: Redemption) => {
    copyText(item.key).then(() => showToast({ message: '兑换码已复制', severity: NotificationSeverity.SUCCESS }));
  };

  const statusBadge = (status: number) => {
    if (status === 3) return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">已使用</span>;
    if (status === 2) return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">已禁用</span>;
    return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">未使用</span>;
  };

  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">名称</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">额度</th>
            <th className="px-4 py-3 font-medium">创建时间</th>
            <th className="px-4 py-3 font-medium">兑换时间</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-400">{item.id}</td>
              <td className="px-4 py-3"><b>{item.name}</b></td>
              <td className="px-4 py-3">
                {item.status === 1 || item.status === 2 ? (
                  <div className="flex items-center gap-2">
                    <Switch checked={item.status === 1} disabled={busyId === item.id} aria-label={`切换兑换码 ${item.id} 状态`} onCheckedChange={() => handleToggle(item)} />
                    {statusBadge(item.status)}
                  </div>
                ) : (
                  statusBadge(item.status)
                )}
              </td>
              <td className="px-4 py-3">{formatQuota(item.quota)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{formatTime(item.created_time)}</td>
              <td className="px-4 py-3 whitespace-nowrap">{item.redeemed_time ? formatTime(item.redeemed_time) : '尚未兑换'}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label="复制兑换码" onClick={() => handleCopy(item)}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="编辑兑换码" disabled={item.status !== 1 && item.status !== 2} onClick={() => onEdit(item)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="删除兑换码" disabled={busyId === item.id} onClick={() => handleDelete(item)}>
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length && <EmptyState error="" label="兑换码" reload={reload} />}
    </TableShell>
  );
}
