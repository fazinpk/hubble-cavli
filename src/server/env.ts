import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  SCRAPE_SECRET: z.string().min(16),
  SCRAPE_COOLDOWN_SECONDS: z.coerce.number().int().min(0).default(300),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cachedEnv: ServerEnv | undefined;

// Parsed on first use rather than at import, so `next build` doesn't need runtime secrets.
export const getServerEnv = (): ServerEnv => {
  cachedEnv ??= serverEnvSchema.parse(process.env);
  return cachedEnv;
};

const googleEnvSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
  GOOGLE_CALENDAR_ID: z.string().min(1).default("primary"),
});

export type GoogleEnv = z.infer<typeof googleEnvSchema>;

let cachedGoogleEnv: GoogleEnv | undefined;

export const getGoogleEnv = (): GoogleEnv => {
  cachedGoogleEnv ??= googleEnvSchema.parse(process.env);
  return cachedGoogleEnv;
};
