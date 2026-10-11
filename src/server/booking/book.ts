import "server-only";

import { SLOT_DURATION_MINUTES } from "@consts/booking.const";
import { ConsultationStatus } from "@generated/prisma/client";
import {
  createMeetEvent,
  deleteCalendarEvent,
  type MeetEvent,
} from "@server/google/calendar";
import { sendBookingConfirmation } from "@server/mail/booking-email";
import {
  confirmBooking,
  findConsultationForBooking,
  findUpcomingBookingByEmail,
  markConfirmationSent,
  releaseSlot,
  reserveSlot,
} from "@server/repositories/booking.repo";

import { getAvailableSlots } from "./availability";

export type BookingResult =
  | {
      ok: true;
      startsAt: Date;
      endsAt: Date;
      meetLink: string;
      emailSent: boolean;
    }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "already_booked"; startsAt: Date }
  | { ok: false; reason: "slot_unavailable" }
  | { ok: false; reason: "calendar_failed" };

const isSlotAvailable = async (startsAt: Date) => {
  const slot = startsAt.toISOString();
  const days = await getAvailableSlots();
  return days.some(({ slots }) => slots.includes(slot));
};

const buildEventDescription = ({
  email,
  phone,
  company,
  message,
}: {
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
}) =>
  [
    `Email: ${email}`,
    phone && `Phone: ${phone}`,
    company && `Company: ${company}`,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

export const bookConsultation = async (
  consultationId: string,
  startsAt: Date,
): Promise<BookingResult> => {
  const consultation = await findConsultationForBooking(consultationId);
  if (!consultation) return { ok: false, reason: "not_found" };

  if (
    consultation.status === ConsultationStatus.BOOKED &&
    consultation.booking
  ) {
    return {
      ok: false,
      reason: "already_booked",
      startsAt: consultation.booking.startsAt,
    };
  }

  const upcoming = await findUpcomingBookingByEmail(
    consultation.email,
    new Date(),
  );
  if (upcoming) {
    return { ok: false, reason: "already_booked", startsAt: upcoming.startsAt };
  }

  if (!(await isSlotAvailable(startsAt))) {
    return { ok: false, reason: "slot_unavailable" };
  }

  const endsAt = new Date(startsAt.getTime() + SLOT_DURATION_MINUTES * 60_000);
  const booking = await reserveSlot(consultationId, startsAt, endsAt);
  if (!booking) return { ok: false, reason: "slot_unavailable" };

  let event: MeetEvent;
  try {
    event = await createMeetEvent({
      requestId: booking.id,
      summary: `Cavli IoT consultation: ${consultation.name}`,
      description: buildEventDescription(consultation),
      start: startsAt,
      end: endsAt,
      attendee: { email: consultation.email, name: consultation.name },
    });
  } catch (error) {
    console.error(`Calendar event for booking ${booking.id} failed:`, error);
    await releaseSlot(booking.id, consultationId);
    return { ok: false, reason: "calendar_failed" };
  }

  try {
    await confirmBooking(booking.id, consultationId, {
      googleEventId: event.eventId,
      meetLink: event.meetLink,
    });
  } catch (error) {
    await deleteCalendarEvent(event.eventId).catch(() => undefined);
    await releaseSlot(booking.id, consultationId);
    throw error;
  }

  const emailSent = await sendBookingConfirmation({
    uid: event.iCalUid,
    name: consultation.name,
    email: consultation.email,
    message: consultation.message,
    start: startsAt,
    end: endsAt,
    meetLink: event.meetLink,
  }).then(
    () => true,
    (error: unknown) => {
      // The meeting exists, so a failed email keeps the booking.
      console.error(
        `Confirmation email for booking ${booking.id} failed:`,
        error,
      );
      return false;
    },
  );
  if (emailSent) await markConfirmationSent(booking.id);

  return { ok: true, startsAt, endsAt, meetLink: event.meetLink, emailSent };
};
