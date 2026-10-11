import "server-only";

import { getGoogleEnv } from "@server/env";

import { getGoogleAccessToken } from "./auth";
import { CALENDAR_API_URL, GOOGLE_REQUEST_TIMEOUT_MS } from "./consts";
import { freeBusyResponseSchema, type BusyInterval } from "./schemas";

const calendarRequest = async (path: string, init: RequestInit) => {
  const response = await fetch(`${CALENDAR_API_URL}${path}`, {
    ...init,
    headers: {
      authorization: `Bearer ${await getGoogleAccessToken()}`,
      "content-type": "application/json",
    },
    signal: AbortSignal.timeout(GOOGLE_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Google Calendar ${path} failed (${response.status}): ${await response.text()}`,
    );
  }
  return response.json() as Promise<unknown>;
};

export const getBusyIntervals = async (
  timeMin: Date,
  timeMax: Date,
): Promise<BusyInterval[]> => {
  const { GOOGLE_CALENDAR_ID } = getGoogleEnv();
  const { calendars } = freeBusyResponseSchema.parse(
    await calendarRequest("/freeBusy", {
      method: "POST",
      body: JSON.stringify({
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        items: [{ id: GOOGLE_CALENDAR_ID }],
      }),
    }),
  );

  const [calendar] = Object.values(calendars);
  if (!calendar || calendar.errors?.length) {
    throw new Error(
      `Free/busy unavailable: ${calendar?.errors?.map(({ reason }) => reason).join(", ") ?? "calendar missing from response"}`,
    );
  }
  return calendar.busy;
};
