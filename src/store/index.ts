import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { NotificationSeverity } from '~/common';
import type { SiteInfo, User } from '~/api/oneApi';

/** 与 api/oneApi.ts 中 AUTH_STORAGE_KEY 保持一致，用于本地登录态持久化。 */
const AUTH_STORAGE_KEY = 'user';

// Theme mode: 'light' | 'dark' | 'system'
export const themeModeAtom = atomWithStorage<string>('color-theme', 'system');

// Toast state
export type ToastState = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
  showIcon?: boolean;
};

export const toastState = atom<ToastState>({
  open: false,
  message: '',
  severity: NotificationSeverity.SUCCESS,
  showIcon: true,
});

// Language
export const langAtom = atomWithStorage<string>(
  'lang',
  typeof navigator !== 'undefined' ? navigator.language || 'en' : 'en',
);

// Sidebar (for layout)
export const sidebarExpandedAtom = atomWithStorage<boolean>('sidebarExpanded', true);

// 当前登录用户；持久化到 localStorage，键名与 api 层 401 登出逻辑一致。
export const accountAtom = atomWithStorage<User | null>(AUTH_STORAGE_KEY, null);

// 站点公开信息（系统名称 / OAuth 配置等），登录前即需要。
export const siteInfoAtom = atom<SiteInfo | null>(null);

// 标记站点信息是否已成功加载，供 AuthGuard 决定是否放行。
export const isUserLoadedAtom = atom<boolean>(false);
