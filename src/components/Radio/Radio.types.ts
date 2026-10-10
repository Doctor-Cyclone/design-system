import type { ComponentPropsWithRef } from 'react';
export type RadioProps = Omit<
  ComponentPropsWithRef<'input'>,
  'type' | 'children'
> & { label: string; name: string; value: string };
