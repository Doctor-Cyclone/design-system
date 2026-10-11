import type {
  FocusEventHandler,
  KeyboardEventHandler,
  ReactElement,
} from 'react';
export type TooltipTriggerProps = {
  'aria-describedby'?: string;
  onFocus?: FocusEventHandler<HTMLElement>;
  onBlur?: FocusEventHandler<HTMLElement>;
  onKeyDown?: KeyboardEventHandler<HTMLElement>;
};
export type TooltipProps = {
  children: ReactElement<TooltipTriggerProps>;
  content: string;
  delay?: number;
  className?: string;
};
