import "server-only";
import nodemailer from "nodemailer";

import { getMailEnv } from "@server/env";

import { SMTP_HOST, SMTP_PORT } from "./consts";

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

export const getMailTransport = () => {
  const { GMAIL_USER, GMAIL_APP_PASSWORD } = getMailEnv();
  transporter ??= nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
  });
  return transporter;
};
