import { z } from "zod";

import { createConsultation } from "@server/repositories/consultation.repo";
import { consultSchema } from "@validation/consult.schema";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => undefined);
  if (body === undefined) {
    return Response.json(
      { error: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const result = consultSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        error: "Please correct the highlighted fields",
        fieldErrors: z.flattenError(result.error).fieldErrors,
      },
      { status: 400 },
    );
  }

  const consultation = await createConsultation(result.data);

  return Response.json(consultation, { status: 201 });
}
