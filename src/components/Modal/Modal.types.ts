import type { ReactNode, RefObject } from 'react';
export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  initialFocusRef?: RefObject<HTMLElement | null>;
  closeOnOverlay?: boolean;
  closeLabel?: string;
  className?: string;
};
