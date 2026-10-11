import { useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "@google/model-viewer";

import type { ModelStatus } from "./type";

type ProgressEvent = CustomEvent<{ totalProgress: number }>;

export const useModelViewerController = () => {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [status, setStatus] = useState<ModelStatus>("loading");
  const [progress, setProgress] = useState(0);
  const [attempt, setAttempt] = useState(0);

  // The library touches `window` when imported, so it is loaded in the browser only.
  useEffect(() => {
    import("@google/model-viewer").catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const handleProgress = (event: Event) =>
      setProgress((event as ProgressEvent).detail.totalProgress);
    const handleLoad = () => setStatus("ready");
    const handleError = () => setStatus("error");

    viewer.addEventListener("progress", handleProgress);
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("progress", handleProgress);
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, [attempt]);

  const retry = () => {
    setStatus("loading");
    setProgress(0);
    setAttempt((current) => current + 1);
  };

  const resetView = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.cameraOrbit = "auto auto auto";
    viewer.cameraTarget = "auto auto auto";
    viewer.fieldOfView = "auto";
    viewer.jumpCameraToGoal();
  };

  return {
    viewerRef,
    status,
    progressPercent: Math.round(progress * 100),
    attempt,
    retry,
    resetView,
  };
};
