import { useId } from 'react';
import type { SwitchProps } from './Switch.types';
import styles from './Switch.module.css';
export function Switch({ label, id, className, ...props }: SwitchProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label
      htmlFor={inputId}
      className={[styles.label, className].filter(Boolean).join(' ')}
    >
      <input
        {...props}
        id={inputId}
        type="checkbox"
        role="switch"
        className={styles.input}
      />
      <span aria-hidden="true" className={styles.track}>
        <span className={styles.thumb} />
      </span>
      <span>{label}</span>
    </label>
  );
}
