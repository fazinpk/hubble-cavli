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

export const FORM_CARD_CLASS_NAME =
  "rounded-3xl border border-brand/15 bg-linear-to-br from-brand-soft via-white to-brand-soft/60 p-6 shadow-xl shadow-brand/10 sm:p-8";

export const GENERIC_SUBMIT_ERROR =
  "Something went wrong. Please try again in a moment.";
