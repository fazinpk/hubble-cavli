import type { ConsultInput } from "@validation/consult.schema";

export const CONSULT_DEFAULT_VALUES: ConsultInput = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

export const getProductMessage = (productName: string) =>
  `I'd like to discuss the ${productName} module for my project.`;

export const GENERIC_SUBMIT_ERROR =
  "Something went wrong. Please try again in a moment.";
