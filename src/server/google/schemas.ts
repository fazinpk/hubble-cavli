import { z } from "zod";

export const tokenResponseSchema = z.object({
  access_token: z.string().min(1),
  expires_in: z.number().int().positive(),
});

const intervalSchema = z.object({
  start: z.coerce.date(),
  end: z.coerce.date(),
});

export const freeBusyResponseSchema = z.object({
  calendars: z.record(
    z.string(),
    z.object({
      busy: z.array(intervalSchema),
      errors: z.array(z.object({ reason: z.string() })).optional(),
    }),
  ),
});

export type BusyInterval = z.infer<typeof intervalSchema>;
