import { FormEvent, useState } from 'react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { request } from '~/api/oneApi';
import Field from '../../components/Field';

export default function ChannelDialog({ open, onOpenChange, onDone }: { open: boolean; onOpenChange: (value: boolean) => void; onDone: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [models, setModels] = useState('gpt-4o');
  const save = async (event: FormEvent) => {
    event.preventDefault();
    await request('/api/channel', { method: 'POST', body: JSON.stringify({ name, key, models, type: 1, status: 1, group: 'default' }) });
    onOpenChange(false);
    await onDone();
  };
  return (
    <OGDialog open={open} onOpenChange={onOpenChange}>
      <OGDialogContent>
        <OGDialogHeader>
          <OGDialogTitle>添加渠道</OGDialogTitle>
        </OGDialogHeader>
        <form onSubmit={save} className="space-y-4">
          <Field label="渠道名称">
            <input required value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
          <Field label="渠道密钥">
            <textarea required value={key} onChange={(event) => setKey(event.target.value)} />
          </Field>
          <Field label="支持模型">
            <input value={models} onChange={(event) => setModels(event.target.value)} />
          </Field>
          <Button type="submit">保存渠道</Button>
        </form>
      </OGDialogContent>
    </OGDialog>
  );
}
