import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import {
  Bell,
  ChevronDown,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Server,
  Settings,
  Sun,
  Users,
} from 'lucide-react';
import { Button } from '@librechat/client';
import { request } from '~/api/oneApi';
import { accountAtom } from '~/store';
import { cn } from '~/utils';

const menu = [
  { to: '/panel/dashboard', label: '总览', icon: LayoutDashboard },
  { to: '/panel/channel', label: '渠道', icon: Server, admin: true },
  { to: '/panel/token', label: '令牌', icon: KeyRound },
  { to: '/panel/log', label: '日志', icon: ClipboardList },
  { to: '/panel/topup', label: '充值', icon: CreditCard },
  { to: '/panel/user', label: '用户', icon: Users, admin: true },
  { to: '/panel/profile', label: '我的账户', icon: CircleUserRound },
  { to: '/panel/setting', label: '系统设置', icon: Settings, root: true },
];

/** 面板应用壳，仅管理导航、主题和当前会话。 */
export default function PanelLayout() {
  const user = useAtomValue(accountAtom);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role ?? 1;
  const title =
    (
      {
        dashboard: '总览',
        channel: '渠道管理',
        token: '令牌管理',
        log: '调用日志',
        topup: '充值中心',
        user: '用户管理',
        profile: '账户设置',
        setting: '系统设置',
      } as Record<string, string>
    )[location.pathname.split('/').pop() ?? ''] ?? 'One API';
  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('color-theme', next ? 'dark' : 'light');
    setDark(next);
  };
  return (
    <div className="min-h-dvh bg-[#f7f8fc] text-slate-900 dark:bg-[#111827] dark:text-slate-100">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[252px] flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform dark:border-slate-700 dark:bg-slate-900 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}>
        <Link to="/panel/dashboard" className="mb-8 flex items-center gap-3 px-2">
          <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 font-black text-white">O</span>
          <span>
            <b>One API</b>
            <small className="block text-xs text-slate-400">管理控制台</small>
          </span>
        </Link>
        <nav className="flex-1 space-y-1">
          {menu
            .filter((item) => (!item.admin || role >= 10) && (!item.root || role >= 100))
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium',
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                  )
                }>
                <Icon className="size-[19px]" />
                {label}
              </NavLink>
            ))}
        </nav>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-50 p-3 dark:bg-slate-800">
          <span className="grid size-8 place-items-center rounded-full bg-indigo-600 text-xs text-white">{(user?.username || 'U')[0]}</span>
          <span className="min-w-0 flex-1">
            <b className="block truncate text-sm">{user?.display_name || user?.username || '加载中'}</b>
            <small className="text-slate-400">{role >= 10 ? '管理员' : '普通用户'}</small>
          </span>
          <ChevronDown className="size-4" />
        </div>
      </aside>
      {open && <button aria-label="关闭导航" className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" onClick={() => setOpen(false)} />}
      <main className="min-h-dvh lg:pl-[252px]">
        <header className="sticky top-0 z-20 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/80 px-5 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80 lg:px-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(true)} aria-label="打开导航">
              <Menu />
            </Button>
            <div>
              <h1 className="text-lg font-bold">{title}</h1>
              <small className="hidden text-slate-400 sm:block">管理你的 AI 模型服务与用量</small>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="切换主题">
              {dark ? <Sun /> : <Moon />}
            </Button>
            <Button variant="ghost" size="icon" aria-label="通知">
              <Bell />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="退出登录"
              onClick={() => {
                void request('/api/user/logout', { method: 'GET' }).finally(() => {
                  localStorage.removeItem('user');
                  navigate('/login');
                });
              }}>
              <LogOut />
            </Button>
          </div>
        </header>
        <div className="mx-auto max-w-[1440px] p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
