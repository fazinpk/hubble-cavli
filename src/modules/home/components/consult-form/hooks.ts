import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PRODUCTS } from "@consts/products.const";
import { consultSchema, type ConsultInput } from "@validation/consult.schema";

import {
  CONSULT_DEFAULT_VALUES,
  GENERIC_SUBMIT_ERROR,
  getProductMessage,
} from "./consts";
import type { ConsultCreatedResponse, ConsultErrorResponse } from "./type";

export const useConsultFormController = () => {
  const searchParams = useSearchParams();
  const product = PRODUCTS.find(
    ({ slug }) => slug === searchParams.get("product"),
  );

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [consultation, setConsultation] =
    useState<ConsultCreatedResponse | null>(null);

  const form = useForm<ConsultInput>({
    resolver: zodResolver(consultSchema),
    mode: "onTouched",
    defaultValues: {
      ...CONSULT_DEFAULT_VALUES,
      message: product ? getProductMessage(product.name) : "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const response = await fetch("/api/consult", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setConsultation((await response.json()) as ConsultCreatedResponse);
        return;
      }

      const { error, fieldErrors } =
        (await response.json()) as ConsultErrorResponse;
      Object.entries(fieldErrors ?? {}).forEach(([field, messages]) => {
        form.setError(field as keyof ConsultInput, { message: messages[0] });
      });
      setSubmitError(error);
    } catch {
      setSubmitError(GENERIC_SUBMIT_ERROR);
    }
  });

  return {
    form,
    onSubmit,
    submitError,
    consultation,
    submittedName: form.getValues("name"),
  };
};
