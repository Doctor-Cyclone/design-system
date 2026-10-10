import { useId } from 'react';
import type { InputProps } from './Input.types';
import styles from './Input.module.css';

export function Input({
  label,
  hint,
  error,
  prefix,
  suffix,
  id,
  className,
  required,
  disabled,
  'aria-describedby': describedBy,
  ...props
}: InputProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const description =
    [describedBy, hint && `${inputId}-hint`, error && `${inputId}-error`]
      .filter(Boolean)
      .join(' ') || undefined;
  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <div
        className={styles.control}
        data-disabled={disabled || undefined}
        data-invalid={Boolean(error) || undefined}
      >
        {prefix && <span className={styles.adornment}>{prefix}</span>}
        <input
          {...props}
          id={inputId}
          required={required}
          disabled={disabled}
          aria-describedby={description}
          aria-invalid={error ? true : props['aria-invalid']}
          className={styles.input}
        />
        {suffix && <span className={styles.adornment}>{suffix}</span>}
      </div>
      {hint && (
        <p id={`${inputId}-hint`} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
