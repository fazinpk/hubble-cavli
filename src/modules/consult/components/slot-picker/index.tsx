"use client";

import type { FC } from "react";
import classNames from "classnames";
import { CalendarClockIcon, LoaderIcon, RotateCcwIcon } from "lucide-react";

import { buttonVariants } from "@components/ui/button/consts";
import { APP_TIMEZONE_LABEL } from "@consts/config.const";
import { SLOT_DURATION_MINUTES } from "@consts/booking.const";
import { FORM_CARD_CLASS_NAME } from "@modules/consult/consts";
import {
  formatDayMonth,
  formatDayTime,
  formatTime,
  formatWeekday,
} from "@utils/date";

import BookingConfirmation from "../booking-confirmation";
import {
  SLOT_OPTION_CLASS_NAME,
  SLOT_OPTION_IDLE_CLASS_NAME,
  SLOT_OPTION_SELECTED_CLASS_NAME,
} from "./consts";
import { useSlotPickerController } from "./hooks";
import type { SlotPickerProps } from "./type";

const optionClassName = (selected: boolean) =>
  classNames(
    SLOT_OPTION_CLASS_NAME,
    selected ? SLOT_OPTION_SELECTED_CLASS_NAME : SLOT_OPTION_IDLE_CLASS_NAME,
  );

const SlotPicker: FC<SlotPickerProps> = ({ consultationId, name, email }) => {
  const {
    status,
    days,
    selectedDate,
    selectedSlot,
    activeDay,
    selectDate,
    selectSlot,
    retry,
    confirm,
    isConfirming,
    bookingError,
    booking,
  } = useSlotPickerController(consultationId);

  if (booking) return <BookingConfirmation booking={booking} email={email} />;

  return (
    <div className={FORM_CARD_CLASS_NAME}>
      <h3 className="text-xl font-bold text-navy">Pick a time</h3>
      <p className="mt-1 text-sm text-muted">
        Thanks, {name}. Choose a {SLOT_DURATION_MINUTES}-minute slot for your
        Google Meet call. Times are in {APP_TIMEZONE_LABEL}.
      </p>

      {status === "loading" && (
        <div
          className="grid min-h-60 place-items-center text-muted"
          role="status"
        >
          <span className="flex items-center gap-2 text-sm">
            <LoaderIcon size={18} className="animate-spin" aria-hidden />
            Loading available times…
          </span>
        </div>
      )}

      {status === "error" && (
        <div className="mt-6 rounded-xl bg-danger/10 p-4 text-sm" role="alert">
          <p className="font-semibold text-danger">
            We couldn&apos;t load available times.
          </p>
          <button
            type="button"
            onClick={retry}
            className="mt-2 inline-flex items-center gap-1.5 font-semibold text-brand hover:text-brand-strong"
          >
            <RotateCcwIcon size={14} aria-hidden />
            Try again
          </button>
        </div>
      )}

      {status === "ready" && days.length === 0 && (
        <p className="mt-6 rounded-xl bg-white p-4 text-sm text-muted">
          All slots for the next week are taken. We&apos;ll reach out by email
          to find a time.
        </p>
      )}

      {status === "ready" && activeDay && (
        <>
          <div
            className="-mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-1"
            aria-label="Day"
            role="group"
          >
            {days.map(({ date }) => (
              <button
                key={date}
                type="button"
                onClick={() => selectDate(date)}
                aria-pressed={date === selectedDate}
                className={classNames(
                  optionClassName(date === selectedDate),
                  "flex min-w-20 shrink-0 flex-col items-center",
                )}
              >
                <span className="text-xs font-medium opacity-80">
                  {formatWeekday(date)}
                </span>
                {formatDayMonth(date)}
              </button>
            ))}
          </div>

          <div
            className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4"
            aria-label="Time"
            role="group"
          >
            {activeDay.slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => selectSlot(slot)}
                aria-pressed={slot === selectedSlot}
                className={optionClassName(slot === selectedSlot)}
              >
                {formatTime(new Date(slot))}
              </button>
            ))}
          </div>

          <p
            className="mt-5 flex items-center gap-2 text-sm text-ink"
            aria-live="polite"
          >
            <CalendarClockIcon
              size={18}
              className="shrink-0 text-brand"
              aria-hidden
            />
            {selectedSlot
              ? formatDayTime(new Date(selectedSlot))
              : "Select a time to continue."}
          </p>
        </>
      )}

      {bookingError && (
        <p
          className="mt-5 rounded-xl bg-danger/10 px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {bookingError}
        </p>
      )}

      {status === "ready" && activeDay && (
        <button
          type="button"
          onClick={() => void confirm()}
          disabled={!selectedSlot || isConfirming}
          className={buttonVariants({
            size: "lg",
            className:
              "mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60",
          })}
        >
          {isConfirming && (
            <LoaderIcon size={18} className="animate-spin" aria-hidden />
          )}
          {isConfirming ? "Booking your call…" : "Confirm booking"}
        </button>
      )}
    </div>
  );
};

export default SlotPicker;
