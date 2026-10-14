"use client";

import type { FC } from "react";
import { XIcon } from "lucide-react";

import { buttonVariants } from "@components/ui/button/consts";
import Modal from "@components/ui/modal";

import ConsultForm from "../consult-form";
import { useConsultModalController } from "./hooks";
import type { ConsultModalProps } from "./type";

const ConsultModal: FC<ConsultModalProps> = ({ product }) => {
  const { isOpen, openModal, closeModal } = useConsultModalController();

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={buttonVariants({ size: "lg" })}
      >
        Consult about {product.name}
      </button>

      <Modal
        open={isOpen}
        onClose={closeModal}
        label={`Consult about ${product.name}`}
      >
        <div className="flex h-full items-center justify-center p-4 sm:p-6">
          <div className="relative flex max-h-full w-full max-w-2xl flex-col">
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 z-10 grid size-10 place-items-center rounded-full text-muted transition hover:bg-white hover:text-navy sm:top-4 sm:right-4"
              aria-label="Close"
              title="Close"
            >
              <XIcon size={22} aria-hidden />
            </button>
            <div className="min-h-0 overflow-y-auto overscroll-contain rounded-3xl">
              <ConsultForm product={product} />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ConsultModal;
