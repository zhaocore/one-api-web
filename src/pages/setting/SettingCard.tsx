import { ReactNode } from 'react';

/** 设置页分区卡片：标题 + 可选说明 + 内容。 */
export default function SettingCard({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-base font-bold">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}
