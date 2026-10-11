"use client";

import type { FC } from "react";
import { LoaderIcon } from "lucide-react";

import { buttonVariants } from "@components/ui/button/consts";
import FormField from "@components/ui/form-field";
import {
  FIELD_CONTROL_CLASS_NAME,
  getErrorId,
} from "@components/ui/form-field/consts";
import type { ConsultInput } from "@validation/consult.schema";

import SlotPicker from "../slot-picker";
import { FORM_CARD_CLASS_NAME } from "./consts";
import { useConsultFormController } from "./hooks";

const ConsultForm: FC = () => {
  const { form, onSubmit, submitError, consultation, submittedName } =
    useConsultFormController();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  if (consultation) return <SlotPicker name={submittedName} />;

  const controlProps = (name: keyof ConsultInput, required = false) => {
    const id = `consult-${name}`;
    return {
      ...register(name),
      id,
      "aria-required": required || undefined,
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": errors[name] ? getErrorId(id) : undefined,
      className: FIELD_CONTROL_CLASS_NAME,
    };
  };

  return (
    <form onSubmit={onSubmit} noValidate className={FORM_CARD_CLASS_NAME}>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-navy">Your details</h3>
        <p className="mt-1 text-sm text-muted">
          Tell us about your project. You&apos;ll pick a time next.
        </p>
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            id="consult-name"
            label="Name"
            required
            error={errors.name?.message}
          >
            <input
              {...controlProps("name", true)}
              type="text"
              autoComplete="name"
              placeholder="Your full name"
            />
          </FormField>
          <FormField
            id="consult-email"
            label="Email"
            required
            error={errors.email?.message}
          >
            <input
              {...controlProps("email", true)}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
            />
          </FormField>
          <FormField
            id="consult-phone"
            label="Phone"
            error={errors.phone?.message}
          >
            <input
              {...controlProps("phone")}
              type="tel"
              autoComplete="tel"
              placeholder="+91 98765 43210"
            />
          </FormField>
          <FormField
            id="consult-company"
            label="Company"
            error={errors.company?.message}
          >
            <input
              {...controlProps("company")}
              type="text"
              autoComplete="organization"
              placeholder="Your company name"
            />
          </FormField>
        </div>

        <FormField
          id="consult-message"
          label="How can we help?"
          required
          error={errors.message?.message}
        >
          <textarea
            {...controlProps("message", true)}
            rows={4}
            placeholder="Tell us about your project and which modules you're considering."
          />
        </FormField>

        {submitError && (
          <p
            className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger"
            role="alert"
          >
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonVariants({
            size: "lg",
            className: "w-full disabled:opacity-70",
          })}
        >
          {isSubmitting && (
            <LoaderIcon size={18} className="animate-spin" aria-hidden />
          )}
          {isSubmitting ? "Sending…" : "Continue to pick a slot"}
        </button>
      </div>
    </form>
  );
};

export default ConsultForm;
