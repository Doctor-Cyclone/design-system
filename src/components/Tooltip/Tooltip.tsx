import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import type { KeyboardEventHandler } from 'react';
import type { TooltipProps } from './Tooltip.types';
import styles from './Tooltip.module.css';

function TooltipTrigger({
  children,
  describedBy,
  onKeyDown,
}: {
  children: TooltipProps['children'];
  describedBy?: string;
  onKeyDown: KeyboardEventHandler<HTMLElement>;
}) {
  return cloneElement(children, {
    'aria-describedby': describedBy,
    onKeyDown: (event) => {
      children.props.onKeyDown?.(event);
      if (!event.defaultPrevented) onKeyDown(event);
    },
  });
}

/** Supply a focusable child that forwards aria-describedby and keyboard/focus handlers. Content is non-interactive. */
export function Tooltip({
  children,
  content,
  delay = 400,
  className,
}: TooltipProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const interaction = useRef({ hover: false, focus: false, dismissed: false });
  const clear = () => {
    clearTimeout(showTimer.current);
    clearTimeout(hideTimer.current);
  };
  useEffect(
    () => () => {
      clearTimeout(showTimer.current);
      clearTimeout(hideTimer.current);
    },
    [],
  );
  const show = () => {
    clear();
    if (!interaction.current.dismissed)
      showTimer.current = setTimeout(() => setOpen(true), Math.max(0, delay));
  };
  const hide = () => {
    clear();
    if (!interaction.current.focus && !interaction.current.hover) {
      interaction.current.dismissed = false;
      hideTimer.current = setTimeout(() => setOpen(false), 100);
    }
  };
  const describedBy =
    [children.props['aria-describedby'], open && id]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <span
      className={[styles.wrapper, className].filter(Boolean).join(' ')}
      onPointerEnter={() => {
        interaction.current.hover = true;
        show();
      }}
      onPointerLeave={() => {
        interaction.current.hover = false;
        hide();
      }}
      onFocus={() => {
        interaction.current.focus = true;
        show();
      }}
      onBlur={() => {
        interaction.current.focus = false;
        hide();
      }}
    >
      <TooltipTrigger
        describedBy={describedBy}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && open) {
            event.preventDefault();
            event.stopPropagation();
            clear();
            interaction.current.dismissed = true;
            setOpen(false);
          }
        }}
      >
        {children}
      </TooltipTrigger>
      {open && (
        <span role="tooltip" id={id} className={styles.tooltip}>
          {content}
        </span>
      )}
    </span>
  );
}
