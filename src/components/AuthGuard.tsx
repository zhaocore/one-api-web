import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { apiGet, type User } from '~/api/oneApi';
import { accountAtom, isUserLoadedAtom } from '~/store';
import { Skeleton } from '~/librechat-client/components/Skeleton';

/**
 * 面板区路由守卫：
 * 1. 首次进入时请求 /api/user/self 校验会话并写入 accountAtom；
 * 2. 加载期间展示骨架屏；
 * 3. 会话失效时由 api 层 401 拦截触发 forceLogout，此处兜底重定向 /login。
 */
export default function AuthGuard() {
  const [account, setAccount] = useAtom(accountAtom);
  const [isUserLoaded, setIsUserLoaded] = useAtom(isUserLoadedAtom);
  const location = useLocation();

  useEffect(() => {
    if (isUserLoaded) return;
    let cancelled = false;
    apiGet<User>('/api/user/self')
      .then((user) => {
        if (cancelled) return;
        setAccount(user);
        setIsUserLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        // 未授权时 api 层已触发 forceLogout 并跳转 /login；这里仅标记加载完成。
        setIsUserLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [isUserLoaded, setAccount, setIsUserLoaded]);

  if (!isUserLoaded) {
    return (
      <div className="flex min-h-dvh items-center justify-center gap-3 p-8">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    );
  }

  if (!account) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
