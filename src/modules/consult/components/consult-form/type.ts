import type { Product } from "@app-types/product.type";
import type { ConsultInput } from "@validation/consult.schema";

export interface ConsultErrorResponse {
  error: string;
  fieldErrors?: Partial<Record<keyof ConsultInput, string[]>>;
}

export interface ConsultCreatedResponse {
  id: string;
  status: string;
}

export interface ConsultFormProps {
  product?: Product;
}
