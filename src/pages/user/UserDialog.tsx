import { FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { User, apiGet, apiPost, apiPut, renderQuota } from '~/api/oneApi';
import Field from '../../components/Field';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDone: () => Promise<void>;
  user: User | null;
}

export default function UserDialog({ open, onOpenChange, onDone, user }: UserDialogProps) {
  const { showToast } = useToastContext();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('default');
  const [quota, setQuota] = useState(0);
  const [groupOptions, setGroupOptions] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    // 加载分组列表
    apiGet<string[]>('/api/group/').then(setGroupOptions).catch(() => setGroupOptions([]));

    if (user) {
      // 编辑模式：从详情接口加载完整数据
      apiGet<User>(`/api/user/${user.id}`)
        .then((data) => {
          setUsername(data.username);
          setDisplayName(data.display_name || '');
          setPassword('');
          setGroup(data.group || 'default');
          setQuota(data.quota);
        })
        .catch((reason) => {
          showToast({ message: reason instanceof Error ? reason.message : '加载用户失败', severity: NotificationSeverity.ERROR });
        });
    } else {
      setUsername('');
      setDisplayName('');
      setPassword('');
      setGroup('default');
      setQuota(0);
    }
  }, [open, user, showToast]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (user) {
        await apiPut('/api/user/', { id: user.id, username, display_name: displayName, password, group, quota });
        showToast({ message: '用户更新成功', severity: NotificationSeverity.SUCCESS });
      } else {
        await apiPost('/api/user/', { username, display_name: displayName, password, group, quota });
        showToast({ message: '用户创建成功', severity: NotificationSeverity.SUCCESS });
      }
      onOpenChange(false);
      await onDone();
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    } finally {
      setSaving(false);
    }
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent>
        <OGDialogHeader>
          <OGDialogTitle>{user ? '编辑用户' : '新建用户'}</OGDialogTitle>
        </OGDialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="用户名">
            <input required value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" />
          </Field>
          <Field label="显示名称">
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" />
          </Field>
          <Field label="密码">
            <div className="relative">
              <input
                required={!user}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={user ? 'new-password' : 'new-password'}
                placeholder={user ? '留空则不修改' : ''}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </Field>
          {user && (
            <>
              <Field label="额度">
                <div className="flex items-center gap-2">
                  <input type="number" min={0} value={quota} onChange={(event) => setQuota(Number(event.target.value))} />
                  <span className="text-sm text-slate-500">{renderQuota(quota)}</span>
                </div>
              </Field>
              <Field label="分组">
                <select
                  value={group}
                  onChange={(event) => setGroup(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                >
                  {groupOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? '保存中…' : '保存用户'}
          </Button>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
