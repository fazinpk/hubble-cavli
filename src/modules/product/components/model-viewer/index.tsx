"use client";

import type { FC } from "react";
import { AlertTriangleIcon, LoaderIcon, RotateCcwIcon } from "lucide-react";

import { useModelViewerController } from "./hooks";
import type { ModelViewerProps } from "./type";

const ModelViewer: FC<ModelViewerProps> = ({ src, alt, actions }) => {
  const { viewerRef, status, progressPercent, attempt, retry, resetView } =
    useModelViewerController();

  return (
    <div className="relative h-full w-full">
      <model-viewer
        key={attempt}
        ref={viewerRef}
        src={src}
        alt={alt}
        loading="eager"
        camera-controls
        touch-action="none"
        min-field-of-view="10deg"
        shadow-intensity="1"
        exposure="1"
        style={{ width: "100%", height: "100%" }}
      />

      <div className="absolute top-4 right-4 flex items-center gap-2">
        {status === "ready" && (
          <button
            type="button"
            onClick={resetView}
            className="grid size-11 place-items-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            aria-label="Reset view"
            title="Reset view"
          >
            <RotateCcwIcon size={22} aria-hidden />
          </button>
        )}
        {actions}
      </div>

      {status === "loading" && (
        <div
          className="pointer-events-none absolute inset-0 grid place-items-center"
          role="status"
          aria-live="polite"
        >
          <div className="flex flex-col items-center gap-3 text-white">
            <LoaderIcon size={56} className="animate-spin" aria-hidden />
            <span className="text-sm font-medium text-white/80">
              {progressPercent}%
            </span>
            <span className="sr-only">Loading 3D model</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          className="absolute inset-0 grid place-items-center p-6 text-center text-white"
          role="alert"
        >
          <div>
            <AlertTriangleIcon
              size={32}
              className="mx-auto text-amber-300"
              aria-hidden
            />
            <p className="mt-3 font-semibold">
              Couldn&apos;t load the 3D model
            </p>
            <p className="mt-1 text-sm text-white/70">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 rounded-full border border-white/60 px-5 py-2 text-sm font-semibold hover:bg-white/10"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {status === "ready" && (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 text-center text-xs text-white/70">
          Drag to rotate · Scroll or pinch to zoom
        </p>
      )}
    </div>
  );
};

export default ModelViewer;
