import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug, PRODUCTS } from "@consts/products.const";
import ProductDetails from "@modules/product/components/product-details";

export function generateStaticParams() {
  return PRODUCTS.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/products/[slug]">): Promise<Metadata> {
  const product = getProductBySlug((await params).slug);
  if (!product) return {};
  return {
    title: `${product.name} ${product.category} module | Hubble by Cavli Wireless`,
    description: product.tagline,
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/products/[slug]">) {
  const product = getProductBySlug((await params).slug);
  if (!product) notFound();

  return <ProductDetails product={product} />;
}
