import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { toast, toastStore } from './toastStore';
import type { ToastProviderProps, ToastRecord } from './Toast.types';
import styles from './Toast.module.css';
import { CloseIcon } from '../../utils/CloseIcon';

function ToastCard({
  item,
  duration,
}: {
  item: ToastRecord;
  duration: number;
}) {
  const remaining = useRef(duration);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const paused = hover || focus;
  useEffect(() => {
    if (duration === 0 || paused) return;
    const started = Date.now();
    const timer = setTimeout(() => toast.dismiss(item.id), remaining.current);
    return () => {
      clearTimeout(timer);
      remaining.current = Math.max(
        0,
        remaining.current - (Date.now() - started),
      );
    };
  }, [duration, paused, item.id]);
  return (
    <div
      className={styles.card}
      data-kind={item.kind}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false);
      }}
    >
      <span aria-hidden="true" className={styles.icon}>
        {item.kind === 'success' ? '✓' : item.kind === 'error' ? '!' : 'i'}
      </span>
      <p className={styles.message}>{item.message}</p>
      <button
        type="button"
        aria-label={`Dismiss notification: ${item.message}`}
        className={styles.close}
        onClick={() => toast.dismiss(item.id)}
      >
        <CloseIcon />
      </button>
    </div>
  );
}

export function ToastProvider({
  children,
  defaultDuration = 5000,
  label = 'Notifications',
  className,
}: ToastProviderProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getServerSnapshot,
  );
  const renderItems = (error: boolean) =>
    items
      .filter((item) => (item.kind === 'error') === error)
      .map((item) => {
        const duration = item.duration ?? defaultDuration;
        return (
          <ToastCard
            key={item.id}
            item={item}
            duration={
              Number.isFinite(duration) && duration >= 0 ? duration : 5000
            }
          />
        );
      });
  return (
    <>
      {children}
      <section
        aria-label={label}
        className={[styles.viewport, className].filter(Boolean).join(' ')}
      >
        <div
          role="status"
          aria-live="polite"
          aria-atomic="false"
          aria-relevant="additions"
          className={styles.stack}
        >
          {renderItems(false)}
        </div>
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="false"
          aria-relevant="additions"
          className={styles.stack}
        >
          {renderItems(true)}
        </div>
      </section>
    </>
  );
}
