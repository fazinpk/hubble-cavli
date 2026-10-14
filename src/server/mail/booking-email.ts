import "server-only";

import { getMailEnv } from "@server/env";
import { formatDayTime } from "@utils/date";

import { MAIL_SENDER_NAME } from "./consts";
import { buildIcsInvite } from "./ics";
import { getMailTransport } from "./transport";

export interface BookingConfirmationInput {
  uid: string;
  name: string;
  email: string;
  message: string;
  start: Date;
  end: Date;
  meetLink: string;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildHtml = (
  { name, message, meetLink }: BookingConfirmationInput,
  when: string,
) => `<!doctype html>
<html>
  <body style="margin:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#10202e">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px">
          <tr><td>
            <p style="margin:0;font-size:12px;font-weight:bold;letter-spacing:1px;color:#5465ff;text-transform:uppercase">Hubble by Cavli Wireless</p>
            <h1 style="margin:8px 0 0;font-size:24px;color:#0b3953">Your consultation is booked</h1>
            <p style="margin:16px 0 0;font-size:15px;line-height:22px">Hi ${escapeHtml(name)}, thanks for reaching out. An IoT specialist from Cavli will meet you on Google Meet.</p>
            <p style="margin:20px 0 0;padding:16px;border-radius:12px;background:#eef0ff;font-size:16px;font-weight:bold;color:#0b3953">${escapeHtml(when)}</p>
            <p style="margin:24px 0 0"><a href="${escapeHtml(meetLink)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#5465ff;color:#ffffff;font-weight:bold;text-decoration:none">Join Google Meet</a></p>
            <p style="margin:12px 0 0;font-size:13px;color:#5b6b7a">Or open: <a href="${escapeHtml(meetLink)}" style="color:#3b51f7">${escapeHtml(meetLink)}</a></p>
            <p style="margin:24px 0 0;font-size:13px;color:#5b6b7a">A calendar invite is attached so you can add the call to your calendar.</p>
            <p style="margin:24px 0 0;font-size:13px;font-weight:bold;color:#0b3953">Your message</p>
            <p style="margin:4px 0 0;font-size:13px;line-height:20px;color:#5b6b7a;white-space:pre-line">${escapeHtml(message)}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const buildText = (
  { name, message, meetLink }: BookingConfirmationInput,
  when: string,
) =>
  [
    `Hi ${name},`,
    "",
    "Your consultation with Cavli Wireless is booked.",
    "",
    `When: ${when}`,
    `Google Meet: ${meetLink}`,
    "",
    "A calendar invite is attached so you can add the call to your calendar.",
    "",
    "Your message:",
    message,
  ].join("\n");

export const sendBookingConfirmation = async (
  input: BookingConfirmationInput,
) => {
  const { GMAIL_USER } = getMailEnv();
  const when = formatDayTime(input.start);
  const summary = "Cavli Wireless IoT consultation";

  await getMailTransport().sendMail({
    from: { name: MAIL_SENDER_NAME, address: GMAIL_USER },
    to: { name: input.name, address: input.email },
    subject: `Booked: ${summary} on ${when}`,
    text: buildText(input, when),
    html: buildHtml(input, when),
    icalEvent: {
      method: "REQUEST",
      filename: "invite.ics",
      content: buildIcsInvite({
        uid: input.uid,
        start: input.start,
        end: input.end,
        summary,
        description: `Join Google Meet: ${input.meetLink}`,
        location: input.meetLink,
        organizerEmail: GMAIL_USER,
        attendee: { email: input.email, name: input.name },
      }),
    },
  });
};

export interface OwnerBookingNotificationInput {
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  start: Date;
  meetLink: string;
}

const buildOwnerDetails = ({
  email,
  phone,
  company,
}: OwnerBookingNotificationInput) =>
  [
    ["Email", email],
    ["Phone", phone],
    ["Company", company],
  ].filter((detail): detail is [string, string] => Boolean(detail[1]));

const buildOwnerHtml = (
  input: OwnerBookingNotificationInput,
  when: string,
) => `<!doctype html>
<html>
  <body style="margin:0;background:#f6f8fb;font-family:Arial,Helvetica,sans-serif;color:#10202e">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;padding:32px">
          <tr><td>
            <p style="margin:0;font-size:12px;font-weight:bold;letter-spacing:1px;color:#5465ff;text-transform:uppercase">New booking</p>
            <h1 style="margin:8px 0 0;font-size:24px;color:#0b3953">${escapeHtml(input.name)} booked a consultation</h1>
            <p style="margin:20px 0 0;padding:16px;border-radius:12px;background:#eef0ff;font-size:16px;font-weight:bold;color:#0b3953">${escapeHtml(when)}</p>
            <p style="margin:24px 0 0"><a href="${escapeHtml(input.meetLink)}" style="display:inline-block;padding:12px 24px;border-radius:999px;background:#5465ff;color:#ffffff;font-weight:bold;text-decoration:none">Join Google Meet</a></p>
            <p style="margin:12px 0 0;font-size:13px;color:#5b6b7a">Or open: <a href="${escapeHtml(input.meetLink)}" style="color:#3b51f7">${escapeHtml(input.meetLink)}</a></p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0;font-size:13px;line-height:20px">
              ${buildOwnerDetails(input)
                .map(
                  ([label, value]) =>
                    `<tr><td style="padding:2px 16px 2px 0;font-weight:bold;color:#0b3953">${label}</td><td style="padding:2px 0;color:#5b6b7a">${escapeHtml(value)}</td></tr>`,
                )
                .join("")}
            </table>
            <p style="margin:24px 0 0;font-size:13px;font-weight:bold;color:#0b3953">Their message</p>
            <p style="margin:4px 0 0;font-size:13px;line-height:20px;color:#5b6b7a;white-space:pre-line">${escapeHtml(input.message)}</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const buildOwnerText = (input: OwnerBookingNotificationInput, when: string) =>
  [
    `${input.name} booked a consultation.`,
    "",
    `When: ${when}`,
    `Google Meet: ${input.meetLink}`,
    "",
    ...buildOwnerDetails(input).map(([label, value]) => `${label}: ${value}`),
    "",
    "Their message:",
    input.message,
  ].join("\n");

export const sendOwnerBookingNotification = async (
  input: OwnerBookingNotificationInput,
) => {
  const { GMAIL_USER, BOOKING_NOTIFY_EMAIL } = getMailEnv();
  const when = formatDayTime(input.start);

  await getMailTransport().sendMail({
    from: { name: MAIL_SENDER_NAME, address: GMAIL_USER },
    to: BOOKING_NOTIFY_EMAIL ?? GMAIL_USER,
    replyTo: { name: input.name, address: input.email },
    subject: `New booking: ${input.name} on ${when}`,
    text: buildOwnerText(input, when),
    html: buildOwnerHtml(input, when),
  });
};
