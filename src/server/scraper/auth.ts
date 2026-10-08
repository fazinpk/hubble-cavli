import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";

import { getServerEnv } from "@server/env";

export const SCRAPE_SECRET_HEADER = "x-scrape-secret";

const digest = (value: string) => createHash("sha256").update(value).digest();

// Hashing first gives equal-length buffers, which timingSafeEqual requires.
export const hasValidScrapeSecret = (request: Request) => {
  const provided = request.headers.get(SCRAPE_SECRET_HEADER);
  if (!provided) return false;
  return timingSafeEqual(
    digest(provided),
    digest(getServerEnv().SCRAPE_SECRET),
  );
};
