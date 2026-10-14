export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
export const CALENDAR_API_URL = "https://www.googleapis.com/calendar/v3";
export const GOOGLE_REQUEST_TIMEOUT_MS = 10_000;
// Refresh slightly early so a cached token never expires mid-request.
export const TOKEN_EXPIRY_MARGIN_MS = 60_000;
export const MEET_LINK_RETRY_DELAY_MS = 1_500;
export const OWNER_REMINDERS = [
  { method: "email", minutes: 30 },
  { method: "popup", minutes: 10 },
] as const;
