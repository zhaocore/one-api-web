import { FormEvent, useEffect, useState } from 'react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { Redemption, apiGet, apiPost, apiPut, renderQuota } from '~/api/oneApi';
import Field from '../../components/Field';

interface RedemptionDialogProps {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  onDone: () => Promise<void>;
  redemption: Redemption | null;
}

export default function RedemptionDialog({ open, onOpenChange, onDone, redemption }: RedemptionDialogProps) {
  const { showToast } = useToastContext();
  const [name, setName] = useState('');
  const [quota, setQuota] = useState(100000);
  const [count, setCount] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (redemption) {
      apiGet<Redemption>(`/api/redemption/${redemption.id}`)
        .then((data) => {
          setName(data.name);
          setQuota(data.quota);
          setCount(data.count);
        })
        .catch((reason) => {
          showToast({ message: reason instanceof Error ? reason.message : '加载兑换码失败', severity: NotificationSeverity.ERROR });
        });
    } else {
      setName('');
      setQuota(100000);
      setCount(1);
    }
  }, [open, redemption, showToast]);

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (redemption) {
        await apiPut('/api/redemption/', { id: redemption.id, name, quota });
        showToast({ message: '兑换码更新成功', severity: NotificationSeverity.SUCCESS });
      } else {
        const data = await apiPost<string[]>('/api/redemption/', { name, quota, count });
        showToast({ message: `已创建 ${count} 个兑换码`, severity: NotificationSeverity.SUCCESS });
        // 批量创建时自动下载文本文件
        if (data.length > 1) {
          const blob = new Blob([data.join('\n')], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}.txt`;
          link.click();
          URL.revokeObjectURL(url);
        }
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
          <OGDialogTitle>{redemption ? '编辑兑换码' : '新建兑换码'}</OGDialogTitle>
        </OGDialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="名称">
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="额度">
            <div className="flex items-center gap-2">
              <input type="number" min={0} required value={quota} onChange={(event) => setQuota(Number(event.target.value))} />
              <span className="text-sm text-slate-500">{renderQuota(quota)}</span>
            </div>
          </Field>
          {!redemption && (
            <Field label="数量">
              <input type="number" min={1} required value={count} onChange={(event) => setCount(Number(event.target.value))} />
            </Field>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? '保存中…' : '保存兑换码'}
          </Button>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}