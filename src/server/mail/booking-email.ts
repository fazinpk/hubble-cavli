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
