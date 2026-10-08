import { after } from "next/server";

import {
  hasValidScrapeSecret,
  SCRAPE_SECRET_HEADER,
} from "@server/scraper/auth";
import {
  executeScrapeRun,
  getScrapeStatus,
  startScrapeRun,
} from "@server/scraper/run";

export const maxDuration = 300;

export async function POST(request: Request) {
  if (!hasValidScrapeSecret(request)) {
    return Response.json(
      { error: `Missing or invalid ${SCRAPE_SECRET_HEADER} header` },
      { status: 401 },
    );
  }

  const result = await startScrapeRun();

  if (!result.started && result.reason === "already_running") {
    return Response.json(
      { error: "A scrape is already running", runId: result.run.id },
      { status: 409 },
    );
  }
  if (!result.started) {
    return Response.json(
      {
        error: "A scrape finished recently; try again later",
        retryAfterSeconds: result.retryAfterSeconds,
      },
      {
        status: 429,
        headers: { "retry-after": String(result.retryAfterSeconds) },
      },
    );
  }

  after(() => executeScrapeRun(result.run));

  return Response.json(
    {
      runId: result.run.id,
      status: result.run.status,
      statusUrl: "/api/scrape/exhibitors",
    },
    { status: 202 },
  );
}

export async function GET() {
  return Response.json(await getScrapeStatus());
}
