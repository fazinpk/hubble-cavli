import { useState } from "react";

export const useNavBarController = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return {
    isMenuOpen,
    toggleMenu: () => setIsMenuOpen((open) => !open),
    closeMenu: () => setIsMenuOpen(false),
  };
};
