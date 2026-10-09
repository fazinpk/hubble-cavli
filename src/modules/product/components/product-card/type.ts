import type { Product } from "@app-types/product.type";

export interface ProductCardProps {
  product: Product;
  compact?: boolean;
}
