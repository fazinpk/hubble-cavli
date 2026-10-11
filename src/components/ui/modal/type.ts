import type { ReactNode } from "react";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}
