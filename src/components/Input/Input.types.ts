import type { ComponentPropsWithRef, ReactNode } from 'react';
export type InputProps = Omit<
  ComponentPropsWithRef<'input'>,
  'size' | 'prefix'
> & {
  label: string;
  hint?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
};
