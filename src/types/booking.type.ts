export interface SlotDay {
  date: string;
  slots: string[];
}

export interface SlotsResponse {
  timezone: string;
  slotMinutes: number;
  days: SlotDay[];
}
