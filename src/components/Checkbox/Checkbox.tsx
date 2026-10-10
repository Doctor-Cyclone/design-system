import { useCallback, useId } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';
export function Checkbox({
  label,
  id,
  className,
  indeterminate = false,
  ref,
  ...props
}: CheckboxProps) {
  const generated = useId();
  const inputId = id ?? generated;
  const attach = useCallback(
    (node: HTMLInputElement | null) => {
      if (node) node.indeterminate = indeterminate;
      if (typeof ref === 'function') return ref(node);
      if (ref) ref.current = node;
    },
    [indeterminate, ref],
  );
  return (
    <label
      htmlFor={inputId}
      className={[styles.label, className].filter(Boolean).join(' ')}
    >
      <input
        {...props}
        ref={attach}
        id={inputId}
        type="checkbox"
        aria-checked={indeterminate ? 'mixed' : undefined}
        className={styles.input}
      />
      <span>{label}</span>
    </label>
  );
}
