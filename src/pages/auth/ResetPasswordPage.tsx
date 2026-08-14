import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiPost } from '~/api/oneApi';

/** 重置密码页：携带 token 提交新密码。 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await apiPost('/api/user/reset', { email, token, password });
      navigate('/login');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '重置失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-[400px]">
        <h2 className="text-3xl font-bold">重置密码</h2>
        <p className="mt-2 text-slate-500">设置一个新密码</p>
        <label className="mt-8 block text-sm font-medium">
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
          验证码 / Token
          <input
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            className="mt-2 w-full rounded-xl border bg-white px-3 py-3 dark:bg-slate-900"
          />
        </label>
        <label className="mt-5 block text-sm font-medium">
          新密码
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
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        <button disabled={loading} className="mt-7 w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white">
          {loading ? '提交中…' : '重置密码'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          <Link className="text-indigo-600" to="/login">
            返回登录
          </Link>
        </p>
      </form>
    </div>
  );
}
