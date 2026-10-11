"use client";

import type { FC } from "react";

import { useModalController } from "./hooks";
import type { ModalProps } from "./type";

const Modal: FC<ModalProps> = ({ open, onClose, label, children }) => {
  const { dialogRef } = useModalController(open);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={label}
      className="m-0 h-full max-h-none w-full max-w-none bg-transparent p-0 backdrop:bg-black/50"
    >
      {open && children}
    </dialog>
  );
};

export default Modal;
