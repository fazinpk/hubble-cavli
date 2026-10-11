import type { FC } from "react";

import { getErrorId } from "./consts";
import type { FormFieldProps } from "./type";

const FormField: FC<FormFieldProps> = ({
  id,
  label,
  error,
  required = false,
  children,
}) => (
  <div>
    <label htmlFor={id} className="text-sm font-semibold text-navy">
      {label}
      {required && (
        <span className="ml-0.5 text-danger" aria-hidden>
          *
        </span>
      )}
    </label>
    <div className="mt-1.5">{children}</div>
    {error && (
      <p id={getErrorId(id)} className="mt-1.5 text-sm text-danger">
        {error}
      </p>
    )}
  </div>
);

export default FormField;
