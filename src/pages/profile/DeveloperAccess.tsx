import { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Button, useToastContext } from '@librechat/client';
import { NotificationSeverity } from '~/common';
import { apiGet, copyText } from '~/api/oneApi';

export default function DeveloperAccess() {
  const { showToast } = useToastContext();
  const [accessToken, setAccessToken] = useState('');
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setGenerating(true);
    try {
      const token = await apiGet<string>('/api/user/token');
      setAccessToken(token);
      await copyText(token);
      showToast({ message: '访问令牌已生成并复制到剪贴板', severity: NotificationSeverity.SUCCESS });
    } catch (reason) {
      showToast({ message: reason instanceof Error ? reason.message : '生成失败', severity: NotificationSeverity.ERROR });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <section className="rounded-2xl border bg-white p-6 dark:bg-slate-900">
      <h3 className="text-lg font-bold">开发者接入</h3>
      <pre className="mt-6 rounded-xl bg-slate-950 p-4 text-xs text-slate-200">POST /v1/chat/completions</pre>
      <Link to="/panel/token">
        <Button className="mt-5" variant="outline">
          <KeyRound className="size-4" /> 管理令牌
        </Button>
      </Link>

      <div className="mt-8 border-t pt-6">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">访问令牌</h4>
        <p className="mt-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
          此令牌用于系统管理，而非请求 OpenAI 相关服务，请勿混淆。如有泄漏，请立即重置。
        </p>
        {accessToken && (
          <pre className="mt-4 break-all rounded-xl bg-slate-950 p-4 text-xs text-slate-200">{accessToken}</pre>
        )}
        <Button className="mt-4" disabled={generating} onClick={generate}>
          {generating ? '生成中…' : accessToken ? '重置访问令牌' : '生成访问令牌'}
        </Button>
      </div>
    </section>
  );
}
