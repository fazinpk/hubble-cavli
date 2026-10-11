import {
  APP_TIMEZONE,
  APP_TIMEZONE_LABEL,
  APP_UTC_OFFSET,
} from "@consts/config.const";

const LOCALE = "en-GB";

const format = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(LOCALE, { timeZone: APP_TIMEZONE, ...options });

const dayFormat = format({ day: "numeric" });
const monthYearFormat = format({ month: "short", year: "numeric" });
const fullDateFormat = format({
  day: "numeric",
  month: "short",
  year: "numeric",
});
const yearFormat = format({ year: "numeric" });
const dateTimeFormat = format({
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const weekdayFormat = format({ weekday: "short" });
const dayMonthFormat = format({ day: "numeric", month: "short" });
const timeFormat = format({ hour: "numeric", minute: "2-digit", hour12: true });

export const formatYear = (date: Date) => yearFormat.format(date);

// Noon keeps a YYYY-MM-DD date on the same calendar day in IST.
const fromIsoDate = (isoDate: string) =>
  new Date(`${isoDate}T12:00:00${APP_UTC_OFFSET}`);

export const formatWeekday = (isoDate: string) =>
  weekdayFormat.format(fromIsoDate(isoDate));

export const formatDayMonth = (isoDate: string) =>
  dayMonthFormat.format(fromIsoDate(isoDate));

export const formatTime = (date: Date) => timeFormat.format(date);

export const formatDayTime = (date: Date) =>
  `${weekdayFormat.format(date)}, ${dayMonthFormat.format(date)} at ${timeFormat.format(date)} ${APP_TIMEZONE_LABEL}`;

export const formatDateRange = (start: Date, end: Date) =>
  monthYearFormat.format(start) === monthYearFormat.format(end)
    ? `${dayFormat.format(start)}–${fullDateFormat.format(end)}`
    : `${fullDateFormat.format(start)} – ${fullDateFormat.format(end)}`;

export const formatDateTime = (date: Date) =>
  `${dateTimeFormat.format(date)} ${APP_TIMEZONE_LABEL}`;
