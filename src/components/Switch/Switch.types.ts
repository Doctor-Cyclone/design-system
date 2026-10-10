import type { ComponentPropsWithRef } from 'react';
export type SwitchProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children' | 'role'
> & { label: string };
