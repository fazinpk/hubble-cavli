import { z } from "zod";

const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{6,19}$/;

export const consultSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name")
    .max(100, "Name must be 100 characters or fewer"),
  email: z
    .string()
    .trim()
    .max(254, "Email must be 254 characters or fewer")
    .pipe(z.email("Enter a valid email address")),
  phone: z
    .string()
    .trim()
    .regex(PHONE_PATTERN, "Enter a valid phone number")
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(120, "Company must be 120 characters or fewer"),
  message: z
    .string()
    .trim()
    .min(10, "Tell us a little more (at least 10 characters)")
    .max(2000, "Message must be 2000 characters or fewer"),
});

export type ConsultInput = z.infer<typeof consultSchema>;
