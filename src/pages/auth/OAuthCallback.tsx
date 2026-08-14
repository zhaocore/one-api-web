import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { apiGet, type User } from '~/api/oneApi';
import { accountAtom } from '~/store';

type Provider = 'github' | 'lark' | 'oidc';

/** OAuth 接口返回：绑定已有账号时 message 为 'bind'，否则携带用户数据。 */
interface OAuthResult {
  success: boolean;
  message: string;
  data: User;
}

/**
 * 通用 OAuth 回调页：
 * 解析 URL 中 code/state，调用对应 /api/oauth/{provider}。
 * 首次登录写入 accountAtom，绑定已有账号（message === 'bind'）直接放行。
 */
export default function OAuthCallback({ provider }: { provider: Provider }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAccount = useSetAtom(accountAtom);
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    if (!code) {
      setError('缺少授权码，请返回登录页重试');
      return;
    }
    let cancelled = false;
    apiGet<OAuthResult>(`/api/oauth/${provider}`, { code, state: state ?? '' })
      .then((res) => {
        if (cancelled) return;
        if (res.message === 'bind') {
          navigate('/panel/dashboard', { replace: true });
        } else if (res.success) {
          setAccount(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
          navigate('/panel/dashboard', { replace: true });
        } else {
          setError(res.message || 'OAuth 登录失败');
        }
      })
      .catch((reason) => {
        if (cancelled) return;
        setError(reason instanceof Error ? reason.message : 'OAuth 登录失败');
      });
    return () => {
      cancelled = true;
    };
  }, [provider, searchParams, navigate, setAccount]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      {error ? (
        <>
          <h1 className="text-2xl font-bold">登录失败</h1>
          <p className="max-w-sm text-slate-500">{error}</p>
          <a href="/login" className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 font-semibold text-white">
            返回登录
          </a>
        </>
      ) : (
        <>
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
          <p className="text-slate-500">正在完成登录…</p>
        </>
      )}
    </div>
  );
}
