import { useEffect, useState } from "react";

import type {
  BookingErrorResponse,
  BookingResponse,
  SlotDay,
  SlotsResponse,
} from "@app-types/booking.type";

import { BOOKING_NETWORK_ERROR } from "./consts";
import type { SlotsStatus } from "./type";

const fetchSlotDays = async () => {
  const response = await fetch("/api/slots");
  if (!response.ok) throw new Error("Slots request failed");
  return ((await response.json()) as SlotsResponse).days;
};

export const useSlotPickerController = (consultationId: string) => {
  const [status, setStatus] = useState<SlotsStatus>("loading");
  const [days, setDays] = useState<SlotDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [booking, setBooking] = useState<BookingResponse | null>(null);

  useEffect(() => {
    let ignore = false;
    fetchSlotDays()
      .then((availableDays) => {
        if (ignore) return;
        setDays(availableDays);
        setSelectedDate((current) =>
          availableDays.some(({ date }) => date === current)
            ? current
            : (availableDays[0]?.date ?? null),
        );
        setSelectedSlot(null);
        setStatus("ready");
      })
      .catch(() => {
        if (!ignore) setStatus("error");
      });
    return () => {
      ignore = true;
    };
  }, [attempt]);

  const retry = () => {
    setStatus("loading");
    setAttempt((current) => current + 1);
  };

  const selectSlot = (slot: string) => {
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const confirm = async () => {
    if (!selectedSlot) return;
    setIsConfirming(true);
    setBookingError(null);
    try {
      const response = await fetch(`/api/consult/${consultationId}/book`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ startsAt: selectedSlot }),
      });

      if (response.ok) {
        setBooking((await response.json()) as BookingResponse);
        return;
      }

      const { error, code } = (await response.json()) as BookingErrorResponse;
      setBookingError(error);
      if (code === "slot_unavailable") setAttempt((current) => current + 1);
    } catch {
      setBookingError(BOOKING_NETWORK_ERROR);
    } finally {
      setIsConfirming(false);
    }
  };

  return {
    status,
    days,
    selectedDate,
    selectedSlot,
    activeDay: days.find(({ date }) => date === selectedDate),
    selectDate: setSelectedDate,
    selectSlot,
    retry,
    confirm,
    isConfirming,
    bookingError,
    booking,
  };
};
