import type { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import classNames from "classnames";

import type { ProductCardProps } from "./type";

const ProductCard: FC<ProductCardProps> = ({ product, compact = false }) => (
  <Link
    href={`/products/${product.slug}`}
    className="group flex h-full flex-col rounded-2xl border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-lg"
  >
    <div
      className={classNames(
        "relative overflow-hidden rounded-xl bg-surface",
        compact ? "aspect-[4/3]" : "aspect-square",
      )}
    >
      <Image
        src={product.imageUrl}
        alt={`${product.name} module`}
        fill
        sizes="(min-width: 1024px) 20vw, (min-width: 640px) 45vw, 90vw"
        className="object-contain p-6 transition group-hover:scale-105"
      />
    </div>
    <p className="mt-4 text-xs font-semibold tracking-wider text-brand uppercase">
      {product.family}
    </p>
    <h3 className="mt-1 text-xl font-bold text-navy">{product.name}</h3>
    {!compact && (
      <p className="mt-1 flex-1 text-sm text-muted">{product.tagline}</p>
    )}
    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">
      View details
      <ArrowRightIcon
        size={16}
        className="transition group-hover:translate-x-1"
        aria-hidden
      />
    </span>
  </Link>
);

export default ProductCard;
