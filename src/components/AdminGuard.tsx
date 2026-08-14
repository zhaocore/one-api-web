import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { ShieldX } from 'lucide-react';
import { accountAtom } from '~/store';

/** 管理员路由守卫：非管理员访问时展示无权限提示页。 */
export default function AdminGuard({ children }: { children: ReactNode }) {
  const account = useAtomValue(accountAtom);
  const role = account?.role ?? 1;

  if (role < 10) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
        <ShieldX className="size-12 text-rose-500" />
        <h2 className="text-2xl font-bold">无权限访问</h2>
        <p className="max-w-sm text-slate-500">当前账户为普通用户，无权访问管理功能。如需访问，请联系管理员提升权限。</p>
        <Link to="/panel/dashboard" className="mt-2 rounded-xl bg-teal-700 px-5 py-2.5 font-semibold text-white">
          返回总览
        </Link>
      </div>
    );
  }
  return <>{children}</>;
}
