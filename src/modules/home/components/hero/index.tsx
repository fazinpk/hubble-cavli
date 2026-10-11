import type { FC } from "react";
import Image from "next/image";
import classNames from "classnames";

import ButtonLink from "@components/ui/button-link";
import { PRODUCTS } from "@consts/products.const";

const HERO_PRODUCT_SLUGS = ["c41qs", "c16qs", "cqm220", "aq62"];

const Hero: FC = () => {
  const heroProducts = PRODUCTS.filter((product) =>
    HERO_PRODUCT_SLUGS.includes(product.slug),
  );

  return (
    <section className="bg-gradient-to-b from-brand-soft to-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-sm font-semibold tracking-wider text-brand uppercase">
            Cavli Hubble
          </p>
          <h1 className="mt-3 text-4xl font-bold text-navy sm:text-5xl lg:text-6xl">
            One platform.
            <br />
            Every connected device.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Cellular IoT modules with built-in eSIM, managed end to end on Cavli
            Hubble: connectivity, data routing, remote debugging and firmware
            updates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/#consult" size="lg">
              Consult Now
            </ButtonLink>
            <ButtonLink href="/#modules" theme="secondary" size="lg">
              Explore modules
            </ButtonLink>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-4">
          {heroProducts.map((product, index) => (
            <li
              key={product.slug}
              className={classNames("rounded-2xl bg-white p-4 shadow-sm", {
                "translate-y-6": index % 2 === 1,
              })}
            >
              <div className="relative aspect-square">
                <Image
                  src={product.imageUrl}
                  alt={`${product.name} module`}
                  fill
                  loading={index < 2 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-contain p-3"
                />
              </div>
              <p className="mt-2 text-center text-sm font-semibold text-navy">
                {product.name}
                <span className="block text-xs font-medium text-muted">
                  {product.category}
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;
