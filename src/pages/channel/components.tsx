import { FormEvent, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Button, OGDialog, OGDialogContent, OGDialogHeader, OGDialogTitle } from '@librechat/client';
import { Channel, request } from '~/api/oneApi';
import EmptyState from '../../components/EmptyState';
import Field from '../../components/Field';
import StatusBadge from '../../components/StatusBadge';
import TableShell from '../../components/TableShell';

export function ChannelTable({ rows, loading, reload }: { rows: Channel[]; loading: boolean; reload: () => Promise<void> }) {
  return (
    <TableShell loading={loading}>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th>渠道</th>
            <th>状态</th>
            <th>分组</th>
            <th>模型</th>
            <th>响应时间</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.id}>
              <td>
                <b>{item.name || `渠道 #${item.id}`}</b>
                <small className="block text-slate-400">
                  ID {item.id} · 类型 {item.type}
                </small>
              </td>
              <td>
                <StatusBadge value={item.status} />
              </td>
              <td>{item.group || 'default'}</td>
              <td>{item.models || '—'}</td>
              <td>{item.response_time ? `${item.response_time} ms` : '未测试'}</td>
              <td>
                <Button variant="ghost" size="icon" aria-label="编辑渠道">
                  <MoreHorizontal />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && !rows.length && <EmptyState error="" label="渠道" reload={reload} />}
    </TableShell>
  );
}

export function ChannelDialog({ open, onOpenChange, onDone }: { open: boolean; onOpenChange: (value: boolean) => void; onDone: () => Promise<void> }) {
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
