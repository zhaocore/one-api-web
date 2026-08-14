import { renderQuota, renderNumber, type User } from '~/api/oneApi';

/** 展示当前用户余额 / 已用额度 / 调用次数的卡片。 */
export default function UserCard({ user }: { user: User | null }) {
  const rows: Array<[string, string]> = [
    ['余额', user ? renderQuota(user.quota) : '未知'],
    ['已使用', user ? renderQuota(user.used_quota) : '未知'],
    ['调用次数', user ? renderNumber(user.request_count ?? 0) : '未知'],
  ];

  return (
    <section className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
      <h3 className="font-bold">账户概览</h3>
      <div className="mt-4 space-y-4">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between">
            <span className="text-sm text-slate-500">{label}</span>
            <b className="text-xl">{value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
