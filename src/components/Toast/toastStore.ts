import type { ToastKind, ToastOptions, ToastRecord } from './Toast.types';
const empty: readonly ToastRecord[] = [];
let snapshot: readonly ToastRecord[] = empty;
let sequence = 0;
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((listener) => listener());
}
function add(kind: ToastKind, message: string, options: ToastOptions = {}) {
  const id = `ui-toast-${++sequence}`;
  snapshot = [...snapshot, { id, kind, message, duration: options.duration }];
  emit();
  return id;
}
/** Browser event API; mount one ToastProvider per document. duration: 0 keeps a toast until dismissed. */
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    add('success', message, options),
  error: (message: string, options?: ToastOptions) =>
    add('error', message, options),
  info: (message: string, options?: ToastOptions) =>
    add('info', message, options),
  dismiss: (id?: string) => {
    snapshot = id ? snapshot.filter((item) => item.id !== id) : empty;
    emit();
  },
};
export const toastStore = {
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => snapshot,
  getServerSnapshot: () => empty,
};
