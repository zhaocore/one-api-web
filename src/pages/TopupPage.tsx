import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import { Button } from '@librechat/client';
import PageHeader from '../components/PageHeader';

export default function TopupPage() {
  return (
    <>
      <PageHeader title="充值中心" description="兑换额度或查看账户余额。" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-7 text-white">
          <Wallet className="size-9" />
          <p className="mt-10">账户可用额度</p>
          <b className="mt-2 block text-4xl">登录后显示</b>
          <Link to="/panel/profile" className="mt-7 inline-flex rounded-xl bg-white px-4 py-2.5 text-indigo-700">
            查看账户
          </Link>
        </section>
        <section className="rounded-2xl border bg-white p-7 dark:bg-slate-900">
          <h3 className="text-xl font-bold">使用兑换码</h3>
          <input placeholder="请输入兑换码" className="mt-6 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-950" />
          <Button className="mt-4">兑换额度</Button>
        </section>
      </div>
    </>
  );
}
