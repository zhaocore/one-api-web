import { cn } from '~/utils';

export default function StatusBadge({ value }: { value: number }) {
  const enabled = value === 1;
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold',
        enabled
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
      )}>
      {enabled ? '已启用' : '已停用'}
    </span>
  );
}
