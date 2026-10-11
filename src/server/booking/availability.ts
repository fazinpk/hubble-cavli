import "server-only";

import {
  BOOKING_DAY_END_HOUR,
  BOOKING_DAY_START_HOUR,
  BOOKING_MIN_LEAD_MINUTES,
  BOOKING_WEEKDAYS,
  BOOKING_WINDOW_DAYS,
  SLOT_DURATION_MINUTES,
} from "@consts/booking.const";
import { APP_TIMEZONE, APP_UTC_OFFSET } from "@consts/config.const";
import { getBusyIntervals } from "@server/google/calendar";
import type { BusyInterval } from "@server/google/schemas";
import { getBookedSlotStarts } from "@server/repositories/booking.repo";
import type { SlotDay } from "@app-types/booking.type";

const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;
const SLOT_MS = SLOT_DURATION_MINUTES * MINUTE_MS;

// en-CA formats dates as YYYY-MM-DD.
const isoDateFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIMEZONE,
});

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const atLocalTime = (date: string, minutes: number) =>
  new Date(`${date}T${toTime(minutes)}:00${APP_UTC_OFFSET}`);

const isBookingDay = (date: string) =>
  BOOKING_WEEKDAYS.includes(atLocalTime(date, 12 * 60).getUTCDay());

const getDaySlots = (date: string) => {
  const slots: Date[] = [];
  for (
    let minutes = BOOKING_DAY_START_HOUR * 60;
    minutes + SLOT_DURATION_MINUTES <= BOOKING_DAY_END_HOUR * 60;
    minutes += SLOT_DURATION_MINUTES
  ) {
    slots.push(atLocalTime(date, minutes));
  }
  return slots;
};

const getCandidateDays = (now: Date) => {
  const earliestStart = now.getTime() + BOOKING_MIN_LEAD_MINUTES * MINUTE_MS;
  return Array.from({ length: BOOKING_WINDOW_DAYS }, (_, offset) =>
    isoDateFormat.format(new Date(now.getTime() + offset * DAY_MS)),
  )
    .filter(isBookingDay)
    .map((date) => ({
      date,
      slots: getDaySlots(date).filter(
        (start) => start.getTime() >= earliestStart,
      ),
    }));
};

const overlaps = (start: Date, busy: BusyInterval) =>
  start < busy.end && new Date(start.getTime() + SLOT_MS) > busy.start;

const getCalendarBusy = (timeMin: Date, timeMax: Date) =>
  getBusyIntervals(timeMin, timeMax).catch((error: unknown) => {
    // Booked slots in our own database still block double booking.
    console.error("Google free/busy failed, using database only:", error);
    return [];
  });

export const getAvailableSlots = async (
  now = new Date(),
): Promise<SlotDay[]> => {
  const days = getCandidateDays(now);
  const candidates = days.flatMap(({ slots }) => slots);
  if (candidates.length === 0) return [];

  const timeMin = candidates[0];
  const timeMax = new Date(
    candidates[candidates.length - 1].getTime() + SLOT_MS,
  );
  const [bookedStarts, busy] = await Promise.all([
    getBookedSlotStarts(timeMin, timeMax),
    getCalendarBusy(timeMin, timeMax),
  ]);
  const booked = new Set(bookedStarts.map((start) => start.getTime()));

  return days
    .map(({ date, slots }) => ({
      date,
      slots: slots
        .filter(
          (start) =>
            !booked.has(start.getTime()) &&
            !busy.some((interval) => overlaps(start, interval)),
        )
        .map((start) => start.toISOString()),
    }))
    .filter(({ slots }) => slots.length > 0);
};
