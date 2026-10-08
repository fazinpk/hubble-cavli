import "server-only";
import { revalidateTag } from "next/cache";

import { EXHIBITORS_CACHE_TAG } from "@consts/exhibitor.const";
import { ScrapeRunStatus, type ScrapeRun } from "@generated/prisma/client";
import { db } from "@server/db";
import { getServerEnv } from "@server/env";
import { chunk, sleep } from "@utils/async";

import {
  BATCH_PAUSE_MS,
  DETAIL_BATCH_SIZE,
  MIN_RESULT_RATIO,
  STALE_RUN_MS,
} from "./consts";
import type { ExhibitorDetail, ExhibitorListItem } from "./schemas";
import { fetchAllExhibitors, fetchExhibitorDetail } from "./source";
import {
  upsertCategories,
  upsertEventAndShows,
  upsertExhibitor,
} from "./upsert";

export type StartRunResult =
  | { started: true; run: ScrapeRun }
  | { started: false; reason: "already_running"; run: ScrapeRun }
  | { started: false; reason: "cooldown"; retryAfterSeconds: number };

export const startScrapeRun = async (): Promise<StartRunResult> => {
  const now = new Date();
  const cooldownMs = getServerEnv().SCRAPE_COOLDOWN_SECONDS * 1000;

  return db.$transaction(async (tx) => {
    // Serialises concurrent starts: a second request waits here until the first commits.
    await tx.$executeRaw`LOCK TABLE scrape_runs IN SHARE ROW EXCLUSIVE MODE`;

    await tx.scrapeRun.updateMany({
      where: {
        status: ScrapeRunStatus.RUNNING,
        startedAt: { lt: new Date(now.getTime() - STALE_RUN_MS) },
      },
      data: {
        status: ScrapeRunStatus.FAILED,
        finishedAt: now,
        errorMessage: "Run did not finish within the time limit",
      },
    });

    const running = await tx.scrapeRun.findFirst({
      where: { status: ScrapeRunStatus.RUNNING },
    });
    if (running) {
      return { started: false, reason: "already_running", run: running };
    }

    const lastSuccess = await tx.scrapeRun.findFirst({
      where: { status: ScrapeRunStatus.SUCCESS },
      orderBy: { finishedAt: "desc" },
    });
    const elapsedMs = lastSuccess?.finishedAt
      ? now.getTime() - lastSuccess.finishedAt.getTime()
      : Infinity;
    if (elapsedMs < cooldownMs) {
      return {
        started: false,
        reason: "cooldown",
        retryAfterSeconds: Math.ceil((cooldownMs - elapsedMs) / 1000),
      };
    }

    const run = await tx.scrapeRun.create({ data: {} });
    return { started: true, run };
  });
};

const assertPlausibleResult = async (totalCount: number) => {
  const previous = await db.scrapeRun.findFirst({
    where: { status: ScrapeRunStatus.SUCCESS },
    orderBy: { finishedAt: "desc" },
  });
  if (totalCount === 0) {
    throw new Error("Source returned no exhibitors");
  }
  if (previous && totalCount < previous.exhibitorsFound * MIN_RESULT_RATIO) {
    throw new Error(
      `Source returned ${totalCount} exhibitors, far fewer than the previous ${previous.exhibitorsFound}; refusing to treat the rest as removed`,
    );
  }
};

const fetchDetailOrNull = async (
  exhibitor: ExhibitorListItem,
): Promise<ExhibitorDetail | null | "failed"> => {
  try {
    return await fetchExhibitorDetail(exhibitor);
  } catch (error) {
    console.warn(
      `Detail fetch failed for MMI customer ${exhibitor.mmiCustomerId}:`,
      error,
    );
    return "failed";
  }
};

export const executeScrapeRun = async (run: ScrapeRun) => {
  const seenAt = run.startedAt;
  try {
    const { totalCount, exhibitors } = await fetchAllExhibitors(
      (pagesFetched, total) =>
        db.scrapeRun
          .update({
            where: { id: run.id },
            data: { pagesFetched, exhibitorsFound: total },
          })
          .then(() => undefined),
    );
    await assertPlausibleResult(totalCount);
    await upsertEventAndShows(exhibitors);

    const savedCategoryIds = new Set<number>();
    let exhibitorsSaved = 0;
    let detailFailures = 0;

    for (const batch of chunk(exhibitors, DETAIL_BATCH_SIZE)) {
      const details = await Promise.all(batch.map(fetchDetailOrNull));

      const newCategories = details
        .flatMap((detail) =>
          detail && detail !== "failed" ? detail.categories : [],
        )
        .filter((category) => !savedCategoryIds.has(category.id));
      const uniqueNewCategories = [
        ...new Map(newCategories.map((c) => [c.id, c])).values(),
      ];
      await upsertCategories(uniqueNewCategories);
      uniqueNewCategories.forEach((category) =>
        savedCategoryIds.add(category.id),
      );

      for (const [index, exhibitor] of batch.entries()) {
        const detail = details[index];
        if (detail === "failed") detailFailures++;
        await upsertExhibitor(
          exhibitor,
          detail === "failed" ? null : detail,
          seenAt,
        );
        exhibitorsSaved++;
      }

      await db.scrapeRun.update({
        where: { id: run.id },
        data: { exhibitorsSaved, detailFailures },
      });
      await sleep(BATCH_PAUSE_MS);
    }

    await db.scrapeRun.update({
      where: { id: run.id },
      data: { status: ScrapeRunStatus.SUCCESS, finishedAt: new Date() },
    });
    revalidateTag(EXHIBITORS_CACHE_TAG, { expire: 0 });
  } catch (error) {
    console.error(`Scrape run ${run.id} failed:`, error);
    await db.scrapeRun.update({
      where: { id: run.id },
      data: {
        status: ScrapeRunStatus.FAILED,
        finishedAt: new Date(),
        errorMessage: (error as Error).message.slice(0, 1000),
      },
    });
  }
};

export const getScrapeStatus = async () => {
  const [latestRun, lastSuccess] = await Promise.all([
    db.scrapeRun.findFirst({ orderBy: { startedAt: "desc" } }),
    db.scrapeRun.findFirst({
      where: { status: ScrapeRunStatus.SUCCESS },
      orderBy: { finishedAt: "desc" },
    }),
  ]);
  return { latestRun, lastSuccessfulAt: lastSuccess?.finishedAt ?? null };
};
