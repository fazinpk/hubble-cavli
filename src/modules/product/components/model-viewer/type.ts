import type { ReactNode } from "react";

export type ModelStatus = "loading" | "ready" | "error";

export interface ModelViewerProps {
  src: string;
  alt: string;
  actions?: ReactNode;
}
