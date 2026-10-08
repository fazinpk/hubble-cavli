import { APP_TIMEZONE, APP_TIMEZONE_LABEL } from "@consts/config.const";

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

export const formatYear = (date: Date) => yearFormat.format(date);

export const formatDateRange = (start: Date, end: Date) =>
  monthYearFormat.format(start) === monthYearFormat.format(end)
    ? `${dayFormat.format(start)}–${fullDateFormat.format(end)}`
    : `${fullDateFormat.format(start)} – ${fullDateFormat.format(end)}`;

export const formatDateTime = (date: Date) =>
  `${dateTimeFormat.format(date)} ${APP_TIMEZONE_LABEL}`;
