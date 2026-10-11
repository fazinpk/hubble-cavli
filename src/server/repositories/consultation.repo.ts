import "server-only";

import { db } from "@server/db";
import type { ConsultInput } from "@validation/consult.schema";

export const createConsultation = ({
  name,
  email,
  phone,
  company,
  message,
}: ConsultInput) =>
  db.consultation.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      company: company || null,
      message,
    },
    select: { id: true, status: true },
  });
