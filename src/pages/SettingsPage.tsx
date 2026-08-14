import { useState } from 'react';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import TableShell from '../components/TableShell';
import OperationSetting from './setting/OperationSetting';
import OtherSetting from './setting/OtherSetting';
import SystemSetting from './setting/SystemSetting';
import { useSettings } from './setting/useSettings';

const TABS = [
  { key: 'operation', label: '运营设置' },
  { key: 'system', label: '系统设置' },
  { key: 'other', label: '其他设置' },
] as const;

export default function SettingsPage() {
  const { options, loading, saving, load, save, saveMany } = useSettings();
  const [tab, setTab] = useState<string>('operation');

  return (
    <>
      <PageHeader title="系统设置" description="配置服务端运行参数与站点信息。" />
      <div className="mb-6 flex gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === item.key
                ? 'bg-teal-700 text-white'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <TableShell loading={loading}>
        {tab === 'operation' && <OperationSetting options={options} saving={saving} save={save} saveMany={saveMany} />}
        {tab === 'system' && <SystemSetting options={options} saving={saving} save={save} saveMany={saveMany} />}
        {tab === 'other' && <OtherSetting options={options} saving={saving} save={save} />}
      </TableShell>
      {!loading && !Object.keys(options).length && <EmptyState error="" label="设置" reload={load} />}
    </>
  );
}
