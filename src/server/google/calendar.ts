import "server-only";

import { getGoogleEnv } from "@server/env";
import { APP_TIMEZONE } from "@consts/config.const";
import { sleep } from "@utils/async";

import { getGoogleAccessToken } from "./auth";
import {
  CALENDAR_API_URL,
  GOOGLE_REQUEST_TIMEOUT_MS,
  MEET_LINK_RETRY_DELAY_MS,
  OWNER_REMINDERS,
} from "./consts";
import {
  eventResponseSchema,
  freeBusyResponseSchema,
  type BusyInterval,
} from "./schemas";

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
  return response.status === 204 ? null : (response.json() as Promise<unknown>);
};

const eventsPath = () =>
  `/calendars/${encodeURIComponent(getGoogleEnv().GOOGLE_CALENDAR_ID)}/events`;

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

export interface MeetEventInput {
  requestId: string;
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendee: { email: string; name: string };
}

export interface MeetEvent {
  eventId: string;
  iCalUid: string;
  meetLink: string;
}

export const deleteCalendarEvent = async (eventId: string) => {
  await calendarRequest(
    `${eventsPath()}/${encodeURIComponent(eventId)}?sendUpdates=none`,
    { method: "DELETE" },
  );
};

export const createMeetEvent = async ({
  requestId,
  summary,
  description,
  start,
  end,
  attendee,
}: MeetEventInput): Promise<MeetEvent> => {
  // sendUpdates=none: the visitor gets our confirmation email instead of a second invite from Google.
  const created = eventResponseSchema.parse(
    await calendarRequest(
      `${eventsPath()}?conferenceDataVersion=1&sendUpdates=none`,
      {
        method: "POST",
        body: JSON.stringify({
          summary,
          description,
          start: { dateTime: start.toISOString(), timeZone: APP_TIMEZONE },
          end: { dateTime: end.toISOString(), timeZone: APP_TIMEZONE },
          attendees: [{ email: attendee.email, displayName: attendee.name }],
          reminders: { useDefault: false, overrides: OWNER_REMINDERS },
          conferenceData: {
            createRequest: {
              requestId,
              conferenceSolutionKey: { type: "hangoutsMeet" },
            },
          },
        }),
      },
    ),
  );

  let event = created;
  if (!event.hangoutLink) {
    // Google can finish creating the Meet link just after the insert returns.
    await sleep(MEET_LINK_RETRY_DELAY_MS);
    event = eventResponseSchema.parse(
      await calendarRequest(
        `${eventsPath()}/${encodeURIComponent(created.id)}`,
        { method: "GET" },
      ),
    );
  }

  if (!event.hangoutLink) {
    await deleteCalendarEvent(created.id).catch(() => undefined);
    throw new Error("Google Calendar did not return a Meet link");
  }

  return {
    eventId: event.id,
    iCalUid: event.iCalUID,
    meetLink: event.hangoutLink,
  };
};
