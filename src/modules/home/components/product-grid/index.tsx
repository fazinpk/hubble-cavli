import type { FC } from "react";

import SectionHeading from "@components/ui/section-heading";
import { PRODUCTS } from "@consts/products.const";
import ProductCard from "@modules/product/components/product-card";

const ProductGrid: FC = () => (
  <section
    id="modules"
    aria-labelledby="modules-heading"
    className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-6"
  >
    <SectionHeading
      id="modules-heading"
      eyebrow="Modules"
      title="Modules powered by Hubble"
      description="From ultra-low-power NB-IoT to automotive-grade 5G, every module can carry an integrated eSIM managed on the Hubble platform."
    />
    <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {PRODUCTS.map((product) => (
        <li key={product.slug}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  </section>
);

export default ProductGrid;
