import "server-only";

import { getGoogleEnv } from "@server/env";

import {
  GOOGLE_REQUEST_TIMEOUT_MS,
  GOOGLE_TOKEN_URL,
  TOKEN_EXPIRY_MARGIN_MS,
} from "./consts";
import { tokenResponseSchema } from "./schemas";

let cachedToken: { value: string; expiresAt: number } | undefined;

export const getGoogleAccessToken = async () => {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.value;
  }

  const env = getGoogleEnv();
  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
    signal: AbortSignal.timeout(GOOGLE_REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new Error(
      `Google token refresh failed (${response.status}): ${await response.text()}`,
    );
  }

  const token = tokenResponseSchema.parse(await response.json());
  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000 - TOKEN_EXPIRY_MARGIN_MS,
  };
  return cachedToken.value;
};
