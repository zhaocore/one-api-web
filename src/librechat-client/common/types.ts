import type { ReactNode } from 'react';

export type TShowToast = {
  message: string;
  severity?: import('./enum').NotificationSeverity;
  showIcon?: boolean;
  duration?: number;
  status?: 'error' | 'success' | 'warning' | 'info';
};

export type Option = Record<string, unknown> & {
  label?: string;
  value: string | number | null;
  disabled?: boolean;
};

export type OptionWithIcon = Option & {
  icon?: ReactNode;
};
