import type { ModelViewerElement } from "@google/model-viewer";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerAttributes = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src: string;
  alt: string;
  poster?: string;
  loading?: "auto" | "lazy" | "eager";
  "camera-controls"?: boolean;
  "touch-action"?: "pan-y" | "pan-x" | "none";
  "interaction-prompt"?: "auto" | "none";
  "min-field-of-view"?: string;
  "shadow-intensity"?: string;
  exposure?: string;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}
