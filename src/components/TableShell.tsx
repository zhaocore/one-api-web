import { ReactNode } from 'react';

export default function TableShell({ children, loading }: { children: ReactNode; loading: boolean }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      {loading ? <div className="p-10 text-center text-sm text-slate-400">正在加载…</div> : <div className="overflow-x-auto">{children}</div>}
    </div>
  );
}
