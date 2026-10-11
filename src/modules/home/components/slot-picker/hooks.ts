import { useEffect, useState } from "react";

import type { SlotDay, SlotsResponse } from "@app-types/booking.type";

import type { SlotsStatus } from "./type";

const fetchSlotDays = async () => {
  const response = await fetch("/api/slots");
  if (!response.ok) throw new Error("Slots request failed");
  return ((await response.json()) as SlotsResponse).days;
};

export const useSlotPickerController = () => {
  const [status, setStatus] = useState<SlotsStatus>("loading");
  const [days, setDays] = useState<SlotDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    fetchSlotDays()
      .then((availableDays) => {
        if (ignore) return;
        setDays(availableDays);
        setSelectedDate(availableDays[0]?.date ?? null);
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

  return {
    status,
    days,
    selectedDate,
    selectedSlot,
    activeDay: days.find(({ date }) => date === selectedDate),
    selectDate: setSelectedDate,
    selectSlot: setSelectedSlot,
    retry,
  };
};
