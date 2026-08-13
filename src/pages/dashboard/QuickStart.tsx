import { KeyRound, Server } from 'lucide-react';
export default function QuickStart() {
  return (
    <section className="rounded-2xl border bg-white p-5 dark:bg-slate-900">
      <h3 className="font-bold">快速开始</h3>
      <div className="mt-4 space-y-4 text-sm">
        <p>
          <KeyRound className="mr-2 inline size-4" />
          创建访问令牌
        </p>
        <p>
          <Server className="mr-2 inline size-4" />
          添加模型渠道
        </p>
      </div>
    </section>
  );
}
