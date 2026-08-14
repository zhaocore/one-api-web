import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { Wallet } from 'lucide-react';
import { Button, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { apiGet, apiPost, renderQuota, type User } from '~/api/oneApi';
import { accountAtom } from '~/store';
import PageHeader from '../components/PageHeader';

export default function TopupPage() {
  const { showToast } = useToastContext();
  const account = useAtomValue(accountAtom);
  const [quota, setQuota] = useState<number>(account?.quota ?? 0);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [topUpLink, setTopUpLink] = useState('');

  // 加载站点充值链接与最新余额。
  useEffect(() => {
    apiGet<{ top_up_link?: string }>('/api/status')
      .then((info) => setTopUpLink(info.top_up_link ?? ''))
      .catch(() => {
        // 站点信息加载失败不阻塞充值功能。
      });
    apiGet<User>('/api/user/self')
      .then((user) => setQuota(user.quota))
      .catch(() => {
        // 余额加载失败时回退到本地账户快照。
      });
  }, []);

  const topUp = async () => {
    if (!code.trim()) {
      showToast({ message: '请输入兑换码', severity: NotificationSeverity.INFO });
      return;
    }
    setSubmitting(true);
    try {
      const gained = await apiPost<number>('/api/user/topup', { key: code.trim() });
      setQuota((prev) => prev + gained);
      setCode('');
      showToast({ message: `充值成功，到账 ${renderQuota(gained)}`, severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '充值失败', severity: NotificationSeverity.ERROR });
    } finally {
      setSubmitting(false);
    }
  };

  const openTopUpLink = () => {
    if (!topUpLink) {
      showToast({ message: '超级管理员未设置充值链接', severity: NotificationSeverity.ERROR });
      return;
    }
    window.open(topUpLink, '_blank');
  };

  return (
    <>
      <PageHeader title="充值中心" description="兑换额度或查看账户余额。" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-7 text-white">
          <Wallet className="size-9" />
          <p className="mt-10">账户可用额度</p>
          <b className="mt-2 block text-4xl">{renderQuota(quota)}</b>
        </section>
        <section className="rounded-2xl border bg-white p-7 dark:bg-slate-900">
          <h3 className="text-xl font-bold">使用兑换码</h3>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="请输入兑换码"
            className="mt-6 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-950"
          />
          <Button className="mt-4" disabled={submitting} onClick={topUp}>
            {submitting ? '兑换中…' : '兑换额度'}
          </Button>
          <p className="mt-6 text-center text-sm text-slate-500">还没有兑换码？</p>
          <Button className="mt-3 w-full" variant="outline" onClick={openTopUpLink}>
            获取兑换码
          </Button>
        </section>
      </div>
    </>
  );
}
