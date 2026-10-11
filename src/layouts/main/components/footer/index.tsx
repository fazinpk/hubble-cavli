import { Suspense, type FC } from "react";
import Link from "next/link";

import { CAVLI_WEBSITE_URL } from "@consts/config.const";
import { PRODUCTS } from "@consts/products.const";

import BrandMark from "../brand-mark";
import FooterEvent, { FooterEventSkeleton } from "../footer-event";

const Footer: FC = () => (
  <footer className="mt-auto bg-navy text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_auto_2fr]">
      <div className="space-y-3">
        <BrandMark inverse />
        <p className="max-w-xs text-sm text-white/70">
          Cellular IoT modules and connectivity, managed end to end on the
          Hubble platform.
        </p>
      </div>

      <div>
        <h2 className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Modules
        </h2>
        <ul className="mt-3 space-y-2">
          {PRODUCTS.map((product) => (
            <li key={product.slug}>
              <Link
                href={`/products/${product.slug}`}
                className="text-sm text-white/85 hover:text-white"
              >
                {product.name}{" "}
                <span className="text-white/50">· {product.category}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <Suspense fallback={<FooterEventSkeleton />}>
        <FooterEvent />
      </Suspense>
    </div>

    <div className="border-t border-white/10">
      <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/60 sm:px-6">
        Demo built by Fazin P K for a Cavli Wireless assessment. Not an official
        Cavli Wireless website. Visit{" "}
        <a
          href={CAVLI_WEBSITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-white/85 underline hover:text-white"
        >
          cavliwireless.com
        </a>
        .
      </p>
    </div>
  </footer>
);

export default Footer;
