import { useEffect, useState } from 'react';
import { Pencil } from 'lucide-react';
import { Button, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { apiPut, formatQuota, type User } from '~/api/oneApi';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
      <small className="text-slate-500">{label}</small>
      <b className="block">{value}</b>
    </div>
  );
}

function Binding({ bound, label }: { bound: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
        bound ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
      }`}
    >
      {label}：{bound ? '已绑定' : '未绑定'}
    </span>
  );
}

export default function ProfileSummary({ user, onUpdated }: { user: User | null; onUpdated: (user: User) => void }) {
  const { showToast } = useToastContext();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setUsername(user.username ?? '');
    setDisplayName(user.display_name ?? '');
  }, [user]);

  const submit = async () => {
    if (!username.trim()) {
      showToast({ message: '用户名不能为空', severity: NotificationSeverity.ERROR });
      return;
    }
    if (password && password.length < 8) {
      showToast({ message: '密码不能小于 8 个字符', severity: NotificationSeverity.ERROR });
      return;
    }
    if (password !== confirmPassword) {
      showToast({ message: '两次输入的密码不一致', severity: NotificationSeverity.ERROR });
      return;
    }
    setSaving(true);
    try {
      // 后端 UpdateSelf：password 为空则保持原密码不变。
      await apiPut<void>('/api/user/self', {
        username: username.trim(),
        display_name: displayName,
        ...(password ? { password } : {}),
      });
      setPassword('');
      setConfirmPassword('');
      showToast({ message: '用户信息更新成功', severity: NotificationSeverity.SUCCESS });
      if (user) onUpdated({ ...user, username: username.trim(), display_name: displayName });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '更新失败', severity: NotificationSeverity.ERROR });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 dark:bg-slate-900">
      <h3 className="text-lg font-bold">{user?.display_name || user?.username || '加载中'}</h3>
      <p className="text-slate-500">{user?.email || '尚未绑定邮箱'}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Binding bound={!!user?.wechat_id} label="微信" />
        <Binding bound={!!user?.github_id} label="GitHub" />
        <Binding bound={!!user?.email} label="邮箱" />
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <Fact label="用户名" value={user?.username || '—'} />
        <Fact label="用户组" value={user?.group || 'default'} />
        <Fact label="已用额度" value={formatQuota(user?.used_quota ?? 0)} />
        <Fact label="剩余额度" value={formatQuota((user?.quota ?? 0) - (user?.used_quota ?? 0))} />
      </div>

      <div className="mt-8 border-t pt-6">
        <h4 className="mb-4 flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
          <Pencil className="size-4" /> 编辑资料
        </h4>
        <div className="space-y-4">
          <label className="block text-sm text-slate-500">
            用户名
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 dark:bg-slate-950"
            />
          </label>
          <label className="block text-sm text-slate-500">
            显示名称
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="请输入显示名称"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 dark:bg-slate-950"
            />
          </label>
          <label className="block text-sm text-slate-500">
            新密码（留空则不修改）
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入新密码"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 dark:bg-slate-950"
            />
          </label>
          <label className="block text-sm text-slate-500">
            确认新密码
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="请再次输入新密码"
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2 dark:bg-slate-950"
            />
          </label>
          <Button disabled={saving} onClick={submit}>
            {saving ? '保存中…' : '保存修改'}
          </Button>
        </div>
      </div>
    </section>
  );
}
