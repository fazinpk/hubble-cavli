import { bookConsultation } from "@server/booking/book";
import { formatDayTime } from "@utils/date";
import { bookingSchema } from "@validation/booking.schema";
import type {
  BookingErrorCode,
  BookingErrorResponse,
  BookingResponse,
} from "@app-types/booking.type";

const bookingError = (code: BookingErrorCode, error: string, status: number) =>
  Response.json({ error, code } satisfies BookingErrorResponse, { status });

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/consult/[id]/book">,
) {
  const { id } = await ctx.params;
  const body: unknown = await request.json().catch(() => undefined);
  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    return bookingError(
      "invalid_request",
      "Select a time slot before confirming",
      400,
    );
  }

  const result = await bookConsultation(id, new Date(parsed.data.startsAt));

  if (result.ok) {
    return Response.json(
      {
        startsAt: result.startsAt.toISOString(),
        endsAt: result.endsAt.toISOString(),
        meetLink: result.meetLink,
        emailSent: result.emailSent,
      } satisfies BookingResponse,
      { status: 201 },
    );
  }

  switch (result.reason) {
    case "not_found":
      return bookingError(
        "not_found",
        "We couldn't find your request. Please submit the form again.",
        404,
      );
    case "already_booked":
      return bookingError(
        "already_booked",
        `You already have a call booked for ${formatDayTime(result.startsAt)}.`,
        409,
      );
    case "slot_unavailable":
      return bookingError(
        "slot_unavailable",
        "That time is no longer available. Please pick another slot.",
        409,
      );
    case "calendar_failed":
      return bookingError(
        "calendar_failed",
        "We couldn't create the meeting. Please try again.",
        502,
      );
  }
}
