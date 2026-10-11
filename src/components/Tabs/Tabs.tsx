import { useId, useRef, useState } from 'react';
import type { TabsProps } from './Tabs.types';
import styles from './Tabs.module.css';

/** Horizontal tabs with automatic activation; content should be local and render without network latency. */
export function Tabs({
  label,
  items,
  value,
  defaultValue,
  onValueChange,
  className,
}: TabsProps) {
  const id = useId();
  const [internal, setInternal] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const enabled = items.filter((item) => !item.disabled);
  const selected =
    enabled.find((item) => item.value === (value ?? internal))?.value ??
    enabled[0]?.value;
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const activate = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        className={styles.list}
      >
        {items.map((item, index) => (
          <button
            key={item.value}
            ref={(element) => {
              if (element) buttons.current.set(item.value, element);
              else buttons.current.delete(item.value);
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-controls={`${id}-panel-${index}`}
            aria-selected={selected === item.value}
            disabled={item.disabled}
            tabIndex={selected === item.value ? 0 : -1}
            className={styles.tab}
            onClick={() => activate(item.value)}
            onKeyDown={(event) => {
              if (
                !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
              )
                return;
              event.preventDefault();
              const current = enabled.findIndex(
                (tab) => tab.value === item.value,
              );
              const next =
                event.key === 'Home'
                  ? enabled[0]
                  : event.key === 'End'
                    ? enabled.at(-1)
                    : enabled[
                        (current +
                          (event.key === 'ArrowRight' ? 1 : -1) +
                          enabled.length) %
                          enabled.length
                      ];
              if (next) {
                activate(next.value);
                buttons.current.get(next.value)?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={selected !== item.value}
          tabIndex={0}
          className={styles.panel}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
