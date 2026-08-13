import { ComponentType } from 'react';
import { Activity, ArrowUpRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { formatQuota } from '~/api/oneApi';

export default function DashboardStats({ quota, logCount }: { quota: number; logCount: number }) {
  const cards: ReadonlyArray<[string, string, ComponentType<{ className?: string }>]> = [
    ['本期消耗', formatQuota(quota), Activity],
    ['调用次数', String(logCount), ArrowUpRight],
    ['运行状态', '正常', CheckCircle2],
    ['可用模型', '—', ShieldCheck],
  ];
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map(([label, value, Icon]) => (
        <div key={label} className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
          <Icon className="float-right text-indigo-600" />
          <p className="text-sm text-slate-500">{label}</p>
          <b className="mt-5 block text-2xl">{value}</b>
        </div>
      ))}
    </div>
  );
}
