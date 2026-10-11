export const FIELD_CONTROL_CLASS_NAME = [
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink shadow-xs",
  "placeholder:text-muted/60 transition",
  "focus:border-brand focus:ring-4 focus:ring-brand/15 focus:outline-none",
  "aria-invalid:border-danger aria-invalid:focus:ring-danger/15",
].join(" ");

export const getErrorId = (id: string) => `${id}-error`;
