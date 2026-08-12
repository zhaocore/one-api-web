import type { ReactNode } from 'react';

export enum NotificationSeverity {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type TShowToast = {
  message: string;
  severity?: NotificationSeverity;
  showIcon?: boolean;
  duration?: number;
  status?: 'error' | 'success' | 'warning' | 'info';
};

export type TDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type Option = Record<string, unknown> & {
  label?: string;
  value: string | number | null;
};

export type OptionWithIcon = Option & {
  icon?: ReactNode;
};

export type DropdownValueSetter = (value: string | Option | OptionWithIcon) => void;
