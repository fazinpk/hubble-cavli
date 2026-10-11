import type { FC } from "react";
import { CalendarCheck2Icon, CheckCircle2Icon, MailIcon } from "lucide-react";

import { FORM_CARD_CLASS_NAME } from "@modules/consult/consts";
import { formatDayTime } from "@utils/date";

import type { BookingConfirmationProps } from "./type";

const BookingConfirmation: FC<BookingConfirmationProps> = ({
  booking,
  email,
}) => (
  <div className={`${FORM_CARD_CLASS_NAME} text-center`} role="status">
    <CheckCircle2Icon size={48} className="mx-auto text-brand" aria-hidden />
    <h3 className="mt-4 text-2xl font-bold text-navy">You&apos;re booked!</h3>

    <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 font-semibold text-navy shadow-xs">
      <CalendarCheck2Icon size={20} className="text-brand" aria-hidden />
      {formatDayTime(new Date(booking.startsAt))}
    </p>

    {booking.emailSent ? (
      <div className="mt-6 text-sm text-muted">
        <p className="flex items-center justify-center gap-2">
          <MailIcon size={16} className="shrink-0" aria-hidden />
          Confirmation sent to {email}
        </p>
        <p className="mt-1 text-xs">
          Check your spam folder if you don&apos;t see it.
        </p>
      </div>
    ) : (
      <p
        className="mt-6 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
        role="alert"
      >
        Your call is booked, but we couldn&apos;t send the confirmation email.
        Save this Meet link:{" "}
        <a
          href={booking.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold break-all underline"
        >
          {booking.meetLink}
        </a>
      </p>
    )}
  </div>
);

export default BookingConfirmation;
