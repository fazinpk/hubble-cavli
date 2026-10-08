import type { FC } from "react";
import Link from "next/link";
import { OrbitIcon } from "lucide-react";
import classNames from "classnames";

import type { BrandMarkProps } from "./type";

const BrandMark: FC<BrandMarkProps> = ({ inverse = false }) => (
  <Link
    href="/"
    className="flex items-center gap-2"
    aria-label="Hubble by Cavli home"
  >
    <span
      className={classNames(
        "grid size-9 place-items-center rounded-xl",
        inverse ? "bg-white/10 text-white" : "bg-brand text-white",
      )}
    >
      <OrbitIcon size={20} aria-hidden />
    </span>
    <span className="leading-tight">
      <span
        className={classNames(
          "block text-lg font-bold",
          inverse ? "text-white" : "text-navy",
        )}
      >
        Hubble
      </span>
      <span
        className={classNames(
          "block text-xs font-medium",
          inverse ? "text-white/70" : "text-muted",
        )}
      >
        by Cavli Wireless
      </span>
    </span>
  </Link>
);

export default BrandMark;
