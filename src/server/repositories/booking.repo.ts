import "server-only";

import { ConsultationStatus, Prisma } from "@generated/prisma/client";
import { db } from "@server/db";

export const getBookedSlotStarts = async (from: Date, to: Date) => {
  const bookings = await db.booking.findMany({
    where: { startsAt: { gte: from, lt: to } },
    select: { startsAt: true },
  });
  return bookings.map(({ startsAt }) => startsAt);
};

export const findConsultationForBooking = (id: string) =>
  db.consultation.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      message: true,
      status: true,
      booking: { select: { startsAt: true } },
    },
  });

export const findUpcomingBookingByEmail = (email: string, now: Date) =>
  db.booking.findFirst({
    where: {
      startsAt: { gt: now },
      consultation: { email, status: ConsultationStatus.BOOKED },
    },
    select: { startsAt: true },
  });

// The unique starts_at index is what stops two visitors taking the same slot.
export const reserveSlot = async (
  consultationId: string,
  startsAt: Date,
  endsAt: Date,
) => {
  try {
    return await db.booking.create({
      data: { consultationId, startsAt, endsAt },
      select: { id: true },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }
    throw error;
  }
};

export const releaseSlot = (bookingId: string, consultationId: string) =>
  db.$transaction([
    db.booking.delete({ where: { id: bookingId } }),
    db.consultation.update({
      where: { id: consultationId },
      data: { status: ConsultationStatus.FAILED },
    }),
  ]);

export const confirmBooking = (
  bookingId: string,
  consultationId: string,
  { googleEventId, meetLink }: { googleEventId: string; meetLink: string },
) =>
  db.$transaction([
    db.booking.update({
      where: { id: bookingId },
      data: { googleEventId, meetLink },
    }),
    db.consultation.update({
      where: { id: consultationId },
      data: { status: ConsultationStatus.BOOKED },
    }),
  ]);

export const markConfirmationSent = (bookingId: string) =>
  db.booking.update({
    where: { id: bookingId },
    data: { confirmationSentAt: new Date() },
  });
