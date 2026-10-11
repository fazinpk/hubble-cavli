import { useState } from "react";

export const useProductMediaController = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return {
    isViewerOpen,
    openViewer: () => setIsViewerOpen(true),
    closeViewer: () => setIsViewerOpen(false),
  };
};
