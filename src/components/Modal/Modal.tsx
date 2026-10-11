import { useEffect, useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  focusableElements,
  isolateModal,
  isTopModal,
} from '../../utils/modalLayer';
import type { ModalProps } from './Modal.types';
import styles from './Modal.module.css';
import { CloseIcon } from '../../utils/CloseIcon';

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeOnOverlay = true,
  closeLabel = 'Close dialog',
  className,
}: ModalProps) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useLayoutEffect(() => {
    close.current = onClose;
  }, [onClose]);
  useEffect(() => {
    if (!open || !layer.current || !dialog.current) return;
    const overlay = layer.current;
    const panel = dialog.current;
    const opener =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const synchronizeTheme = () => {
      const theme = anchor.current
        ?.closest('[data-theme]')
        ?.getAttribute('data-theme');
      if (theme) {
        if (overlay.getAttribute('data-theme') !== theme)
          overlay.setAttribute('data-theme', theme);
      } else overlay.removeAttribute('data-theme');
    };
    synchronizeTheme();
    const themeObserver = new MutationObserver(synchronizeTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
      subtree: true,
    });
    const release = isolateModal(overlay);
    const target = initialFocusRef?.current;
    (target && panel.contains(target)
      ? target
      : (focusableElements(panel)[0] ?? panel)
    ).focus();
    const keydown = (event: KeyboardEvent) => {
      if (!isTopModal(overlay) || event.defaultPrevented) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        close.current();
      }
      if (event.key === 'Tab') {
        const elements = focusableElements(panel);
        const first = elements[0];
        const last = elements.at(-1);
        if (!first) {
          event.preventDefault();
          panel.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first || document.activeElement === panel)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last || document.activeElement === panel)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const keepFocus = (event: FocusEvent) => {
      if (isTopModal(overlay) && !panel.contains(event.target as Node))
        (focusableElements(panel)[0] ?? panel).focus();
    };
    // Bubble phase lets widgets inside the dialog consume Escape before the dialog does.
    document.addEventListener('keydown', keydown);
    document.addEventListener('focusin', keepFocus);
    return () => {
      document.removeEventListener('keydown', keydown);
      document.removeEventListener('focusin', keepFocus);
      themeObserver.disconnect();
      release();
      if (opener?.isConnected && !opener.closest('[inert]')) opener.focus();
    };
  }, [open, initialFocusRef]);

  return (
    <>
      <span ref={anchor} hidden />
      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={layer}
            className={styles.overlay}
            onPointerDown={(event) => {
              if (
                closeOnOverlay &&
                event.target === event.currentTarget &&
                isTopModal(event.currentTarget)
              )
                onClose();
            }}
          >
            <div
              ref={dialog}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${id}-title`}
              aria-describedby={description ? `${id}-description` : undefined}
              tabIndex={-1}
              className={[styles.dialog, className].filter(Boolean).join(' ')}
            >
              <div className={styles.header}>
                <h2 id={`${id}-title`} className={styles.title}>
                  {title}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={closeLabel}
                  className={styles.close}
                >
                  <CloseIcon />
                </button>
              </div>
              {description && (
                <p id={`${id}-description`} className={styles.description}>
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
