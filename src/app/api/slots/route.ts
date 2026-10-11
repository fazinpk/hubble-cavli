import { connection } from "next/server";

import { SLOT_DURATION_MINUTES } from "@consts/booking.const";
import { APP_TIMEZONE } from "@consts/config.const";
import { getAvailableSlots } from "@server/booking/availability";
import type { SlotsResponse } from "@app-types/booking.type";

export async function GET() {
  await connection();

  return Response.json({
    timezone: APP_TIMEZONE,
    slotMinutes: SLOT_DURATION_MINUTES,
    days: await getAvailableSlots(),
  } satisfies SlotsResponse);
}
