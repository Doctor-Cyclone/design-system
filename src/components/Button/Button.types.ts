import type { ComponentPropsWithRef } from 'react';
type NativeButton = Omit<ComponentPropsWithRef<'button'>, 'children'>;
type IconLabel =
  | { iconOnly: true; 'aria-label': string }
  | { iconOnly?: false; 'aria-label'?: string };
export type ButtonProps = NativeButton &
  IconLabel & {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
  };
