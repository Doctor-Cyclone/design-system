import type { ReactNode } from 'react';
export type TabItem = {
  value: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
};
export type TabsProps = {
  label: string;
  items: readonly TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};
