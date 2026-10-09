export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductModel {
  path: string;
  sizeMb: number;
}

export interface Product {
  slug: string;
  name: string;
  family: string;
  category: string;
  tagline: string;
  summary: string;
  highlights: string[];
  specs: ProductSpec[];
  useCases: string[];
  imageUrl: string;
  model: ProductModel;
  sourceUrl: string;
}
