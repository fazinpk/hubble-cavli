import "server-only";

import { db } from "@server/db";

export const getBookedSlotStarts = async (from: Date, to: Date) => {
  const bookings = await db.booking.findMany({
    where: { startsAt: { gte: from, lt: to } },
    select: { startsAt: true },
  });
  return bookings.map(({ startsAt }) => startsAt);
};
