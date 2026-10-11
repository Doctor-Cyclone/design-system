import { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button';
import type { DropdownProps } from './Dropdown.types';
import styles from './Dropdown.module.css';

export function Dropdown({ label, items, disabled, className }: DropdownProps) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const search = useRef({ text: '', time: 0 });
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>();
  const enabled = items.filter((item) => !item.disabled);
  const focusedId =
    enabled.find((item) => item.id === activeId)?.id ?? enabled[0]?.id;
  const expanded = open && !disabled;
  const close = (restore = false) => {
    setOpen(false);
    if (restore) trigger.current?.focus();
  };
  const show = (last = false) => {
    setActiveId(last ? enabled.at(-1)?.id : enabled[0]?.id);
    setOpen(true);
  };
  useEffect(() => {
    if (expanded && focusedId) buttons.current.get(focusedId)?.focus();
  }, [expanded, focusedId]);
  useEffect(() => {
    if (!expanded) return;
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [expanded]);
  return (
    <div
      ref={root}
      className={[styles.root, className].filter(Boolean).join(' ')}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Button
        ref={trigger}
        id={`${id}-trigger`}
        disabled={disabled || enabled.length === 0}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={expanded}
        aria-controls={expanded ? `${id}-menu` : undefined}
        onClick={() => (expanded ? close(true) : show())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            show(event.key === 'ArrowUp');
          }
        }}
      >
        {label} <span aria-hidden="true">⌄</span>
      </Button>
      {expanded && (
        <div
          role="menu"
          tabIndex={-1}
          id={`${id}-menu`}
          aria-labelledby={`${id}-trigger`}
          className={styles.menu}
          onKeyDown={(event) => {
            const index = enabled.findIndex((item) => item.id === focusedId);
            if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
              event.preventDefault();
              const next =
                event.key === 'Home'
                  ? enabled[0]
                  : event.key === 'End'
                    ? enabled.at(-1)
                    : enabled[
                        (index +
                          (event.key === 'ArrowDown' ? 1 : -1) +
                          enabled.length) %
                          enabled.length
                      ];
              setActiveId(next?.id);
            } else if (event.key === 'Escape') {
              event.preventDefault();
              event.stopPropagation();
              close(true);
            } else if (event.key === 'Tab') close(true);
            else if (
              event.key.length === 1 &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey &&
              event.key !== ' '
            ) {
              const now = Date.now();
              const buffer =
                now - search.current.time < 500
                  ? search.current.text + event.key.toLowerCase()
                  : event.key.toLowerCase();
              search.current = { text: buffer, time: now };
              const prefix = [...buffer].every(
                (character) => character === buffer[0],
              )
                ? buffer[0]!
                : buffer;
              const ordered = [
                ...enabled.slice(index + 1),
                ...enabled.slice(0, index + 1),
              ];
              const match = ordered.find((item) =>
                item.label.toLowerCase().startsWith(prefix),
              );
              if (match) {
                event.preventDefault();
                setActiveId(match.id);
              }
            }
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              ref={(element) => {
                if (element) buttons.current.set(item.id, element);
                else buttons.current.delete(item.id);
              }}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              data-danger={item.danger || undefined}
              className={styles.item}
              onClick={() => {
                close(true);
                item.onSelect();
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
