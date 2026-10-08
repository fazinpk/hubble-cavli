"use client";

import type { FC } from "react";
import Link from "next/link";
import { MenuIcon, XIcon } from "lucide-react";

import ButtonLink from "@components/ui/button-link";

import BrandMark from "../brand-mark";
import { CONSULT_HREF, NAV_LINKS } from "./consts";
import { useNavBarController } from "./hooks";

const NavBar: FC = () => {
  const { isMenuOpen, toggleMenu, closeMenu } = useNavBarController();

  return (
    <nav className="border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <BrandMark />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-ink hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href={CONSULT_HREF}>Consult Now</ButtonLink>
        </div>

        <button
          type="button"
          onClick={toggleMenu}
          className="grid size-10 place-items-center rounded-lg text-navy hover:bg-surface md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-line px-4 pb-4 md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="block border-b border-line py-3 font-semibold text-ink"
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink
            href={CONSULT_HREF}
            onClick={closeMenu}
            className="mt-4 w-full"
          >
            Consult Now
          </ButtonLink>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
