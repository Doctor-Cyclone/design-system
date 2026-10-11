import type { ReactNode } from 'react';
export type ToastKind = 'success' | 'error' | 'info';
export type ToastOptions = { duration?: number };
export type ToastRecord = {
  id: string;
  kind: ToastKind;
  message: string;
  duration?: number;
};
export type ToastProviderProps = {
  children?: ReactNode;
  defaultDuration?: number;
  label?: string;
  className?: string;
};
