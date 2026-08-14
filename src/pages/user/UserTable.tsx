import { useState } from 'react';
import { Edit, MoreHorizontal, Trash2, UserCog } from 'lucide-react';
import { Button, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { ROLE_TEXT, User, apiPost, renderNumber, renderQuota } from '~/api/oneApi';
import { hasAdminRole, isRoot } from '~/utils/permission';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';

interface UserTableProps {
  rows: User[];
  loading: boolean;
  reload: () => Promise<void>;
  onEdit: (user: User) => void;
}

export default function UserTable({ rows, loading, reload, onEdit }: UserTableProps) {
  const { showToast } = useToastContext();
  const [busyId, setBusyId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);

  const run = async (id: number, action: () => Promise<void>, successMessage: string) => {
    setBusyId(id);
    setMenuId(null);
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

  const handleToggle = (user: User) => {
    const next = user.status === 1 ? 'disable' : 'enable';
    void run(user.id, () => apiPost('/api/user/manage', { username: user.username, action: next }), next === 'enable' ? '用户已启用' : '用户已禁用');
  };

  const handleDelete = (user: User) => {
    if (!window.confirm(`确定删除用户「${user.username}」？`)) return;
    void run(user.id, () => apiPost('/api/user/manage', { username: user.username, action: 'delete' }), '用户已删除');
  };

  const handleRole = (user: User) => {
    const action = user.role === 1 ? 'promote' : 'demote';
    void run(user.id, () => apiPost('/api/user/manage', { username: user.username, action }), action === 'promote' ? '已提升为管理员' : '已取消管理员');
  };

  const roleBadge = (role: number) => {
    const text = ROLE_TEXT[role] ?? '未知';
    if (role >= 100) return <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">{text}</span>;
    if (role >= 10) return <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">{text}</span>;
    return <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{text}</span>;
  };

  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <th className="px-4 py-3 font-medium">ID</th>
            <th className="px-4 py-3 font-medium">用户名</th>
            <th className="px-4 py-3 font-medium">分组</th>
            <th className="px-4 py-3 font-medium">统计信息</th>
            <th className="px-4 py-3 font-medium">角色</th>
            <th className="px-4 py-3 font-medium">绑定</th>
            <th className="px-4 py-3 font-medium">状态</th>
            <th className="px-4 py-3 font-medium">操作</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <td className="px-4 py-3 text-slate-400">{item.id}</td>
              <td className="px-4 py-3">
                <b>{item.username}</b>
                {item.display_name && <small className="ml-1 text-slate-400">({item.display_name})</small>}
              </td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {item.group || 'default'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700 dark:bg-teal-500/15 dark:text-teal-300" title="剩余额度">
                    {renderQuota(item.quota)}
                  </span>
                  <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700 dark:bg-rose-500/15 dark:text-rose-300" title="已用额度">
                    {renderQuota(item.used_quota)}
                  </span>
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300" title="请求次数">
                    {renderNumber(item.request_count)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">{roleBadge(item.role)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <span className={item.wechat_id ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-600'} title={item.wechat_id ? `微信: ${item.wechat_id}` : '未绑定微信'}>微</span>
                  <span className={item.github_id ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'} title={item.github_id ? `GitHub: ${item.github_id}` : '未绑定 GitHub'}>G</span>
                  <span className={item.email ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'} title={item.email || '未绑定邮箱'}>@</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={item.status === 1}
                    disabled={busyId === item.id}
                    aria-label={`切换用户 ${item.id} 状态`}
                    onCheckedChange={() => handleToggle(item)}
                  />
                  <StatusBadge value={item.status} />
                </div>
              </td>
              <td className="relative px-4 py-3">
                <div className="flex items-center gap-1">
                  {isRoot() && !hasAdminRole(item.role) && (
                    <Button variant="ghost" size="icon" aria-label="提升为管理员" disabled={busyId === item.id} onClick={() => handleRole(item)}>
                      <UserCog className="size-4" />
                    </Button>
                  )}
                  {isRoot() && hasAdminRole(item.role) && item.role < 100 && (
                    <Button variant="ghost" size="icon" aria-label="取消管理员" disabled={busyId === item.id} onClick={() => handleRole(item)}>
                      <UserCog className="size-4 text-amber-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" aria-label="编辑用户" onClick={() => onEdit(item)}>
                    <Edit className="size-4" />
                  </Button>
                  {item.role < 100 && (
                    <Button variant="ghost" size="icon" aria-label="删除用户" disabled={busyId === item.id} onClick={() => handleDelete(item)}>
                      <Trash2 className="size-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length && <EmptyState error="" label="用户" reload={reload} />}
    </TableShell>
  );
}
