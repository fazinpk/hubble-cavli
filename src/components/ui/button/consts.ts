import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold",
    "transition-colors duration-200 whitespace-nowrap",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
  ],
  variants: {
    theme: {
      primary: "bg-brand text-white hover:bg-brand-strong",
      secondary:
        "border border-brand text-brand hover:bg-brand-soft hover:text-brand-strong",
      inverse: "bg-white text-navy hover:bg-brand-soft",
    },
    size: {
      sm: "px-4 py-2 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-base",
    },
  },
  defaultVariants: {
    theme: "primary",
    size: "md",
  },
});
