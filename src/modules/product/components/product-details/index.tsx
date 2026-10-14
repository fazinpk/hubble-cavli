import type { FC } from "react";
import Link from "next/link";
import { CheckIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import classNames from "classnames";

import { PRODUCTS } from "@consts/products.const";
import ConsultModal from "@modules/consult/components/consult-modal";

import ProductCard from "../product-card";
import ProductMedia from "../product-media";
import type { ProductDetailsProps } from "./type";

const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
  const otherProducts = PRODUCTS.filter((p) => p.slug !== product.slug);
  const tags = [...new Set([product.family, product.category])];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          <li className="flex items-center gap-1">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <ChevronRightIcon size={14} aria-hidden />
          </li>
          <li className="flex items-center gap-1">
            <Link href="/#modules" className="hover:text-brand">
              Modules
            </Link>
            <ChevronRightIcon size={14} aria-hidden />
          </li>
          <li aria-current="page" className="font-semibold text-navy">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="text-4xl font-bold text-navy sm:text-5xl">
            {product.name}
          </h1>
          <ul className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <li
                key={tag}
                className={classNames(
                  "rounded-full px-4 py-1 text-sm font-medium text-white",
                  index === 0 ? "bg-sky" : "bg-brand",
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-lg text-ink">{product.tagline}</p>
          <p className="mt-4 text-muted">{product.summary}</p>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {product.highlights.map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-2 text-sm text-ink"
              >
                <CheckIcon
                  size={18}
                  className="mt-0.5 shrink-0 text-brand"
                  aria-hidden
                />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ConsultModal product={product} />
            <a
              href={product.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-strong"
            >
              Official product page
              <ExternalLinkIcon size={14} aria-hidden />
            </a>
          </div>
        </div>

        <ProductMedia product={product} />
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[2fr_1fr]">
        <section aria-labelledby="specs-heading">
          <h2 id="specs-heading" className="text-2xl font-bold text-navy">
            Key specifications
          </h2>
          <dl className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"
              >
                <dt className="text-sm font-semibold text-navy">
                  {spec.label}
                </dt>
                <dd className="text-sm text-ink">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="use-cases-heading">
          <h2 id="use-cases-heading" className="text-2xl font-bold text-navy">
            Use cases
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {product.useCases.map((useCase) => (
              <li
                key={useCase}
                className="rounded-full bg-brand-soft px-3 py-1.5 text-sm font-medium text-brand-strong"
              >
                {useCase}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="other-modules-heading" className="mt-16">
        <h2 id="other-modules-heading" className="text-2xl font-bold text-navy">
          Other modules
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {otherProducts.map((other) => (
            <li key={other.slug}>
              <ProductCard product={other} compact />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default ProductDetails;
