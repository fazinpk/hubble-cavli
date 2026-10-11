export interface SlotDay {
  date: string;
  slots: string[];
}

export interface SlotsResponse {
  timezone: string;
  slotMinutes: number;
  days: SlotDay[];
}

export type BookingErrorCode =
  | "invalid_request"
  | "not_found"
  | "already_booked"
  | "slot_unavailable"
  | "calendar_failed";

export interface BookingErrorResponse {
  error: string;
  code: BookingErrorCode;
}

export interface BookingResponse {
  startsAt: string;
  endsAt: string;
  meetLink: string;
  emailSent: boolean;
}
