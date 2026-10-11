"use client";

import type { FC } from "react";
import Image from "next/image";
import { BoxIcon, XIcon } from "lucide-react";

import Modal from "@components/ui/modal";

import ModelViewer from "../model-viewer";
import { useProductMediaController } from "./hooks";
import type { ProductMediaProps } from "./type";

const ProductMedia: FC<ProductMediaProps> = ({ product }) => {
  const { isViewerOpen, openViewer, closeViewer } = useProductMediaController();

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <div className="relative aspect-[4/3] w-full max-w-xs">
          <Image
            src={product.imageUrl}
            alt={`${product.name} module`}
            fill
            loading="eager"
            fetchPriority="high"
            sizes="320px"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={openViewer}
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-medium text-navy shadow-[0_4px_16px_rgb(11_57_83/0.12)] transition hover:text-brand hover:shadow-[0_6px_20px_rgb(11_57_83/0.18)]"
          >
            View in 3D
            <BoxIcon size={18} aria-hidden />
          </button>
          <p className="text-xs text-muted">
            Interactive model · {product.model.sizeMb} MB
          </p>
        </div>
      </div>

      <Modal
        open={isViewerOpen}
        onClose={closeViewer}
        label={`${product.name} 3D model`}
      >
        <ModelViewer
          src={product.model.path}
          alt={`3D model of the Cavli ${product.name} module`}
          actions={
            <button
              type="button"
              onClick={closeViewer}
              className="grid size-11 place-items-center rounded-full text-white transition hover:bg-white/10"
              aria-label="Close 3D view"
            >
              <XIcon size={30} aria-hidden />
            </button>
          }
        />
      </Modal>
    </>
  );
};

export default ProductMedia;
