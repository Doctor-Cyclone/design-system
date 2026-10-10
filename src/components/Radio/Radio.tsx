import { useId } from 'react';
import type { RadioProps } from './Radio.types';
import styles from './Radio.module.css';
/** Radios with the same name form a native group; wrap related radios in a fieldset with a legend. */
export function Radio({ label, id, className, ...props }: RadioProps) {
  const generated = useId();
  const inputId = id ?? generated;
  return (
    <label
      htmlFor={inputId}
      className={[styles.label, className].filter(Boolean).join(' ')}
    >
      <input {...props} id={inputId} type="radio" className={styles.input} />
      <span>{label}</span>
    </label>
  );
}
