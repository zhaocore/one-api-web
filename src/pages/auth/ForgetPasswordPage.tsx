import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiPost } from '~/api/oneApi';

/** 忘记密码页：输入邮箱 → POST /api/user/reset 发送重置链接/验证。 */
export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await apiPost('/api/user/reset', { email });
      setSuccess('重置请求已提交，请检查邮箱');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '提交失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
      <form onSubmit={submit} className="w-full max-w-[400px]">
        <h2 className="text-3xl font-bold">找回密码</h2>
        <p className="mt-2 text-slate-500">输入注册邮箱以重置密码</p>
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
        {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
        {success && <p className="mt-4 text-sm text-emerald-600">{success}</p>}
        <button disabled={loading} className="mt-7 w-full rounded-xl bg-teal-700 py-3 font-semibold text-white">
          {loading ? '提交中…' : '提交'}
        </button>
        <p className="mt-6 text-center text-sm text-slate-500">
          想起来了？{' '}
          <Link className="text-teal-700" to="/login">
            返回登录
          </Link>
        </p>
      </form>
    </div>
  );
}
