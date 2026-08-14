import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { apiGet, apiPost, getAffCode, type ApiResponse, type User } from '~/api/oneApi';
import { useSiteInfo } from '~/hooks/useSiteInfo';

/**
 * 注册页：用户名 / 邮箱 / 密码 / 确认密码 / 邮箱验证码。
 * 依赖 siteInfo.email_verification 决定是否展示验证码字段；
 * 依赖 siteInfo.turnstile_check 决定是否展示 Cloudflare Turnstile 人机验证。
 * 邀请码 aff 从 URL 读取，随注册请求以 aff_code 提交。
 */
export default function RegisterPage() {
  const siteInfo = useSiteInfo();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [turnstileSiteKey, setTurnstileSiteKey] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  const emailVerification = siteInfo?.email_verification === true;

  // 读取 URL 邀请码并缓存；按站点配置启用 Turnstile。
  useEffect(() => {
    getAffCode();
    if (siteInfo?.turnstile_check === true && siteInfo.turnstile_site_key) {
      setTurnstileEnabled(true);
      setTurnstileSiteKey(siteInfo.turnstile_site_key);
    }
  }, [siteInfo]);

  const sendCode = async () => {
    if (!email) {
      setError('请先填写邮箱地址');
      return;
    }
    if (turnstileEnabled && !turnstileToken) {
      setError('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setSendingCode(true);
    setError('');
    try {
      const params: Record<string, string | number> = { email };
      if (turnstileEnabled) params.turnstile = turnstileToken;
      await apiGet<ApiResponse<null>>('/api/verification', params);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '验证码发送失败');
    } finally {
      setSendingCode(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    if (turnstileEnabled && !turnstileToken) {
      setError('请稍后几秒重试，Turnstile 正在检查用户环境！');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const affCode = getAffCode();
      const query = turnstileEnabled ? `?turnstile=${encodeURIComponent(turnstileToken)}` : '';
      await apiPost<User>(`/api/user/register${query}`, {
        username,
        email,
        password,
        verification_code: emailVerification ? verificationCode : undefined,
        aff_code: affCode || undefined,
      });
      navigate('/login');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-[400px]">
        <h2 className="text-3xl font-bold">创建账户</h2>
        <p className="mt-2 text-slate-500">注册以开始使用 One API</p>
        <label className="mt-8 block text-sm font-medium">
          用户名
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
          />
        </label>
        <label className="mt-5 block text-sm font-medium">
          邮箱
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
          />
        </label>
        <label className="mt-5 block text-sm font-medium">
          密码
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
          />
        </label>
        <label className="mt-5 block text-sm font-medium">
          确认密码
          <input
            type="password"
            value={confirm}
            onChange={(event) => setConfirm(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
          />
        </label>
        {emailVerification && (
          <div className="mt-5 flex gap-2">
            <label className="block flex-1 text-sm font-medium">
              邮箱验证码
              <input
                value={verificationCode}
                onChange={(event) => setVerificationCode(event.target.value)}
                required
                className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
              />
            </label>
            <button
              type="button"
              disabled={sendingCode}
              onClick={sendCode}
              className="mt-8 self-start rounded-xl bg-slate-200 px-4 py-3 text-sm font-medium dark:bg-slate-800">
              {sendingCode ? '发送中…' : '发送验证码'}
            </button>
          </div>
        )}
        {turnstileEnabled && (
          <div className="mt-5">
            <Turnstile
              sitekey={turnstileSiteKey}
              onVerify={(token) => setTurnstileToken(token)}
              onExpire={() => setTurnstileToken('')}
            />
          </div>
        )}
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        <button disabled={loading} className="mt-7 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white">
          {loading ? '注册中…' : '注册'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          已有账户？{' '}
          <Link className="text-indigo-600" to="/login">
            登录
          </Link>
        </p>
      </form>
    </div>
  );
}
