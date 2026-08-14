import { FormEvent, useEffect, useState } from 'react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, Switch, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { Token, apiPost, apiPut } from '~/api/oneApi';
import Field from '../../components/Field';

interface TokenDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDone: () => Promise<void>;
  token: Token | null;
}

export default function TokenDialog({ open, onOpenChange, onDone, token }: TokenDialogProps) {
  const { showToast } = useToastContext();
  const [name, setName] = useState('');
  const [remainQuota, setRemainQuota] = useState(0);
  const [expiredTime, setExpiredTime] = useState(-1);
  const [unlimitedQuota, setUnlimitedQuota] = useState(false);
  const [subnet, setSubnet] = useState('');
  const [models, setModels] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (token) {
      setName(token.name);
      setRemainQuota(token.remain_quota);
      setExpiredTime(token.expired_time);
      setUnlimitedQuota(token.unlimited_quota);
      setSubnet(token.subnet ?? '');
      setModels(token.models ?? '');
    } else {
      setName('');
      setRemainQuota(0);
      setExpiredTime(-1);
      setUnlimitedQuota(false);
      setSubnet('');
      setModels('');
    }
  }, [open, token]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name,
      remain_quota: parseInt(String(remainQuota), 10),
      expired_time: expiredTime,
      unlimited_quota: unlimitedQuota,
      subnet,
      models,
    };
    try {
      if (token) {
        await apiPut('/api/token/', { ...payload, id: token.id });
        showToast({ message: '令牌更新成功', severity: NotificationSeverity.SUCCESS });
      } else {
        await apiPost('/api/token/', payload);
        showToast({ message: '令牌创建成功，请在列表页面点击复制获取令牌', severity: NotificationSeverity.SUCCESS });
      }
      onOpenChange(false);
      await onDone();
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '保存失败', severity: NotificationSeverity.ERROR });
    } finally {
      setSaving(false);
    }
  };

  const toggleExpiry = () => {
    setExpiredTime((prev) => (prev === -1 ? Math.floor(Date.now() / 1000) : -1));
  };

  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent>
        <OGDialogHeader>
          <OGDialogTitle>{token ? '编辑令牌' : '新建令牌'}</OGDialogTitle>
        </OGDialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="令牌名称">
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={unlimitedQuota} onCheckedChange={setUnlimitedQuota} aria-label="无限额度" />
            无限额度
          </div>
          {!unlimitedQuota && (
            <Field label="额度">
              <input type="number" min={0} value={remainQuota} onChange={(event) => setRemainQuota(Number(event.target.value))} />
            </Field>
          )}
          <div className="flex items-center gap-2 text-sm font-medium">
            <Switch checked={expiredTime === -1} onCheckedChange={toggleExpiry} aria-label="永不过期" />
            永不过期
          </div>
          {expiredTime !== -1 && (
            <Field label="过期时间">
              <input type="datetime-local" onChange={(event) => setExpiredTime(Math.floor(new Date(event.target.value).getTime() / 1000))} />
            </Field>
          )}
          <Field label="IP 限制（可选）">
            <input value={subnet} onChange={(event) => setSubnet(event.target.value)} placeholder="例如 192.168.0.0/24" />
          </Field>
          <Field label="模型范围（可选）">
            <input value={models} onChange={(event) => setModels(event.target.value)} placeholder="逗号分隔，留空表示全部模型" />
          </Field>
          <Button type="submit" disabled={saving}>
            {saving ? '保存中…' : token ? '保存令牌' : '创建令牌'}
          </Button>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
