import "server-only";
import { cacheLife, cacheTag } from "next/cache";

import {
  CAVLI_MMI_USER_ID,
  EXHIBITORS_CACHE_TAG,
  FOOTER_LOGOS_LIMIT,
  TOP_COUNTRIES_LIMIT,
} from "@consts/exhibitor.const";
import { ScrapeRunStatus } from "@generated/prisma/client";
import { db } from "@server/db";
import type { ExhibitorSummary } from "@app-types/exhibitor.type";

// MMI names shows "<show> - <city>", e.g. "electronica India - Bangalore".
const splitShowName = (fullName: string) => {
  const [name, city] = fullName.split(" - ").map((part) => part.trim());
  return { name, city: city ?? null };
};

export const getExhibitorSummary =
  async (): Promise<ExhibitorSummary | null> => {
    "use cache";
    cacheLife("max");
    cacheTag(EXHIBITORS_CACHE_TAG);

    const lastRun = await db.scrapeRun.findFirst({
      where: { status: ScrapeRunStatus.SUCCESS },
      orderBy: { finishedAt: "desc" },
    });
    if (!lastRun?.finishedAt) return null;

    const listed = { lastSeenAt: { gte: lastRun.startedAt } };

    const [shows, countsByShow, countries, logos, cavli] = await Promise.all([
      db.show.findMany({ orderBy: { startsAt: "asc" } }),
      db.exhibitor.groupBy({
        by: ["showId"],
        where: listed,
        _count: { _all: true },
      }),
      db.country.findMany({
        select: {
          name: true,
          _count: {
            select: { companies: { where: { exhibitors: { some: listed } } } },
          },
        },
      }),
      db.company.findMany({
        where: { logoUrl: { not: null }, exhibitors: { some: listed } },
        select: { name: true, logoUrl: true },
        orderBy: { name: "asc" },
        take: FOOTER_LOGOS_LIMIT,
      }),
      db.exhibitor.findFirst({
        where: { ...listed, company: { mmiUserId: CAVLI_MMI_USER_ID } },
        select: {
          boothCode: true,
          booth: { select: { hall: true } },
          show: { select: { name: true } },
        },
      }),
    ]);
    if (shows.length === 0) return null;

    const countByShow = new Map(
      countsByShow.map((row) => [row.showId, row._count._all]),
    );
    const showSummaries = shows.map((show) => ({
      name: splitShowName(show.name).name,
      exhibitorCount: countByShow.get(show.id) ?? 0,
    }));
    const countryCounts = countries
      .map((country) => ({
        name: country.name,
        companyCount: country._count.companies,
      }))
      .filter((country) => country.companyCount > 0)
      .sort((a, b) => b.companyCount - a.companyCount);

    return {
      eventTitle: showSummaries.map((show) => show.name).join(" & "),
      city: splitShowName(shows[0].name).city,
      startsAt: shows[0].startsAt,
      endsAt: shows.reduce(
        (latest, show) => (show.endsAt > latest ? show.endsAt : latest),
        shows[0].endsAt,
      ),
      shows: showSummaries,
      totalExhibitors: showSummaries.reduce(
        (sum, show) => sum + show.exhibitorCount,
        0,
      ),
      countryCount: countryCounts.length,
      topCountries: countryCounts.slice(0, TOP_COUNTRIES_LIMIT),
      logos: logos.flatMap(({ name, logoUrl }) =>
        logoUrl ? [{ name, logoUrl }] : [],
      ),
      cavliBooth: cavli && {
        showName: splitShowName(cavli.show.name).name,
        boothCode: cavli.boothCode,
        hall: cavli.booth?.hall ?? null,
      },
      lastSyncedAt: lastRun.finishedAt,
    };
  };
