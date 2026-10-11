import "server-only";

import { ICS_LINE_LIMIT, ICS_ORGANIZER_NAME, ICS_PRODUCT_ID } from "./consts";

export interface IcsEventInput {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  location: string;
  organizerEmail: string;
  attendee: { email: string; name: string };
}

const toIcsDate = (date: Date) =>
  date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");

const escapeText = (value: string) =>
  value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");

const quoteParam = (value: string) => `"${value.replace(/"/g, "")}"`;

const foldLine = (line: string) => {
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += ICS_LINE_LIMIT) {
    parts.push(line.slice(i, i + ICS_LINE_LIMIT));
  }
  return parts.join("\r\n ");
};

export const buildIcsInvite = ({
  uid,
  start,
  end,
  summary,
  description,
  location,
  organizerEmail,
  attendee,
}: IcsEventInput) =>
  [
    "BEGIN:VCALENDAR",
    `PRODID:${ICS_PRODUCT_ID}`,
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    `URL:${location}`,
    `ORGANIZER;CN=${quoteParam(ICS_ORGANIZER_NAME)}:mailto:${organizerEmail}`,
    `ATTENDEE;CN=${quoteParam(attendee.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE:mailto:${attendee.email}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(foldLine)
    .join("\r\n");
