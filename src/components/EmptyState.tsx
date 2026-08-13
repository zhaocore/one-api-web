import { Box, RefreshCw } from 'lucide-react';
import { Button } from '@librechat/client';

export default function EmptyState({ error, label, reload }: { error: string; label: string; reload: () => void }) {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
      <div>
        <Box className="mx-auto size-9 text-slate-300" />
        <p className="mt-3 font-semibold">{error || `暂无${label}`}</p>
        <p className="mt-1 text-sm text-slate-500">{error ? '确认服务端已启动且当前会话拥有访问权限。' : `创建第一个${label}后将在这里展示。`}</p>
        {error && (
          <Button variant="outline" className="mt-4" onClick={reload}>
            <RefreshCw className="size-4" />
            重试
          </Button>
        )}
      </div>
    </div>
  );
}
