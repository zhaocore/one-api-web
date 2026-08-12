import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { NotificationSeverity } from '~/common';

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
