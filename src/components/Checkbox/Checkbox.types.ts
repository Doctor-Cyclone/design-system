import type { ComponentPropsWithRef } from 'react';
export type CheckboxProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children'
> & { label: string; indeterminate?: boolean };
