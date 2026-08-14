import { FormEvent, useEffect, useState } from 'react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { CHANNEL_OPTIONS, Channel, apiPost, apiPut } from '~/api/oneApi';
import Field from '../../components/Field';

interface ChannelDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDone: () => Promise<void>;
  channel: Channel | null;
}

const CHANNEL_TYPES = Object.entries(CHANNEL_OPTIONS).map(([value, label]) => ({ value: Number(value), label }));

export default function ChannelDialog({ open, onOpenChange, onDone, channel }: ChannelDialogProps) {
  const { showToast } = useToastContext();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [models, setModels] = useState('');
  const [group, setGroup] = useState('default');
  const [type, setType] = useState(1);
  const [baseUrl, setBaseUrl] = useState('');
  const [priority, setPriority] = useState(0);
  const [status, setStatus] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (channel) {
      setName(channel.name);
      setKey(channel.key);
      setModels(channel.models);
      setGroup(channel.group || 'default');
      setType(channel.type);
      setBaseUrl(channel.base_url ?? '');
      setPriority(channel.priority);
      setStatus(channel.status === 1);
    } else {
      setName('');
      setKey('');
      setModels('');
      setGroup('default');
      setType(1);
      setBaseUrl('');
      setPriority(0);
      setStatus(true);
    }
  }, [open, channel]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name,
      key,
      models,
      group,
      type,
      base_url: baseUrl,
      priority,
      status: status ? 1 : 2,
    };
    try {
      if (channel) {
        await apiPut<Channel>('/api/channel/', { ...payload, id: channel.id });
        showToast({ message: '渠道更新成功', severity: NotificationSeverity.SUCCESS });
      } else {
        await apiPost('/api/channel/', payload);
        showToast({ message: '渠道创建成功', severity: NotificationSeverity.SUCCESS });
      }
      onOpenChange(false);
      await onDone();
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    } finally {
      setSaving(false);
    }
  };

  const switchType = (nextType: number) => {
    setType(nextType);
    if (nextType === 1 && !models) setModels('gpt-4o');
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent>
        <OGDialogHeader>
          <OGDialogTitle>{channel ? '编辑渠道' : '添加渠道'}</OGDialogTitle>
        </OGDialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="渠道名称">
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="渠道类型">
            <select
              value={type}
              onChange={(event) => switchType(Number(event.target.value))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-900">
              {CHANNEL_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="渠道密钥">
            <textarea required value={key} onChange={(event) => setKey(event.target.value)} placeholder="多个密钥每行一个，可批量创建" />
          </Field>
          <Field label="支持模型">
            <input value={models} onChange={(event) => setModels(event.target.value)} placeholder="逗号分隔，例如 gpt-4o,gpt-4o-mini" />
          </Field>
          <Field label="分组">
            <input value={group} onChange={(event) => setGroup(event.target.value)} />
          </Field>
          {(type === 3 || type === 8) && (
            <Field label="渠道 API 地址">
              <input value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://example.com" />
            </Field>
          )}
          <Field label="优先级">
            <input type="number" min={0} value={priority} onChange={(event) => setPriority(Number(event.target.value))} />
          </Field>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={status} onCheckedChange={setStatus} aria-label="启用状态" />
            启用渠道
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? '保存中…' : '保存渠道'}
          </Button>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
