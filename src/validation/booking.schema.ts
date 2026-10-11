import { z } from "zod";

export const bookingSchema = z.object({
  startsAt: z.iso.datetime("Select a time slot before confirming"),
});

export type BookingInput = z.infer<typeof bookingSchema>;
