import type { ButtonProps } from './Button.types';
import styles from './Button.module.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  iconOnly,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        styles.button,
        styles[variant],
        styles[size],
        iconOnly && styles.iconOnly,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading && <span aria-hidden="true" className={styles.spinner} />}
      {children}
    </button>
  );
}
