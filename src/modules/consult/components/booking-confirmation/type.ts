import type { BookingResponse } from "@app-types/booking.type";

export interface BookingConfirmationProps {
  booking: BookingResponse;
  email: string;
}
