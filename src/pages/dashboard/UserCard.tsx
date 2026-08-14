import { renderQuota, renderNumber, type User } from '~/api/oneApi';

/** 展示当前用户余额 / 已用额度 / 调用次数的卡片。 */
export default function UserCard({ user }: { user: User | null }) {
  const rows: Array<[string, string]> = [
    ['余额', user ? renderQuota(user.quota) : '未知'],
    ['已使用', user ? renderQuota(user.used_quota) : '未知'],
    ['调用次数', user ? renderNumber(user.request_count ?? 0) : '未知'],
  ];

  return (
    <section className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.32)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-none">
      <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">账户概览</p>
        <h3 className="mt-2 truncate text-xl font-semibold tracking-tight text-slate-900 dark:text-white">{user?.display_name || user?.username || '当前账户'}</h3>
      </div>
      <div className="divide-y divide-slate-100 px-6 dark:divide-slate-800">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-6 py-4">
            <span className="text-sm text-slate-500">{label}</span>
            <b className="text-right text-xl tracking-tight text-slate-900 dark:text-white">{value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
