import { ReactNode } from 'react';
import { Search } from 'lucide-react';

export default function SearchToolbar({ onSearch, children }: { onSearch: (value: string) => void; children?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-wrap gap-3">
      <label className="relative min-w-[220px] flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
        <input
          onChange={(event) => onSearch(event.target.value)}
          placeholder="搜索名称、模型或 ID"
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-teal-700 dark:border-slate-700 dark:bg-slate-900"
        />
      </label>
      {children}
    </div>
  );
}
