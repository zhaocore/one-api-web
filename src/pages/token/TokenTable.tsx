import { useState } from 'react';
import { Copy, Edit, Trash2 } from 'lucide-react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { Token, apiDelete, apiPut, copyText, formatQuota, formatTime } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';

interface TokenTableProps {
  tokens: Token[];
  loading: boolean;
  reload: () => Promise<void>;
  onEdit: (token: Token) => void;
}

export default function TokenTable({ tokens, loading, reload, onEdit }: TokenTableProps) {
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

  const handleCopy = async (token: Token) => {
    try {
      await copyText(`sk-${token.key}`);
      showToast({ message: '令牌已复制到剪贴板', severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '复制失败', severity: NotificationSeverity.ERROR });
    }
  };

  const handleToggle = (token: Token) => {
    const next = token.status === 1 ? 2 : 1;
    void run(token.id, () => apiPut('/api/token/?status_only=true', { id: token.id, status: next }), next === 1 ? '令牌已启用' : '令牌已禁用');
  };

  const handleDelete = (token: Token) => {
    if (!window.confirm(`确定删除令牌「${token.name}」？`)) return;
    void run(token.id, () => apiDelete(`/api/token/${token.id}`), '令牌已删除');
  };

  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="px-4 py-3 font-medium">令牌名称</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">已用额度</th>
            <th className="px-4 py-3 font-medium">剩余额度</th>
            <th className="px-4 py-3 font-medium">创建时间</th>
            <th className="px-4 py-3 font-medium">过期时间</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3">
                <b>{item.name}</b>
                <small className="block text-slate-400">sk-••••{item.key.slice(-6)}</small>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.status === 1}
                    disabled={busyId === item.id}
                    aria-label={`切换令牌 ${item.id} 状态`}
                    onCheckedChange={() => handleToggle(item)}
                  />
                  <StatusBadge value={item.status} />
                </div>
              </td>
              <td className="px-4 py-3">{formatQuota(item.used_quota)}</td>
              <td className="px-4 py-3">{item.unlimited_quota ? '无限制' : formatQuota(item.remain_quota)}</td>
              <td className="px-4 py-3">{formatTime(item.created_time)}</td>
              <td className="px-4 py-3">{formatTime(item.expired_time)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" aria-label="复制令牌" onClick={() => handleCopy(item)}>
                    <Copy className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="编辑令牌" onClick={() => onEdit(item)}>
                    <Edit className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="删除令牌" disabled={busyId === item.id} onClick={() => handleDelete(item)}>
                    <Trash2 className="size-4 text-red-500" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !tokens.length && <EmptyState error="" label="令牌" reload={reload} />}
    </TableShell>
  );
}
