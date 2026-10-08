import type { FC } from "react";
import Image from "next/image";
import { connection } from "next/server";

import { getExhibitorSummary } from "@server/repositories/exhibitor.repo";
import { formatDateRange, formatDateTime, formatYear } from "@utils/date";

export const FooterEventSkeleton: FC = () => (
  <div className="space-y-3" aria-hidden>
    <div className="h-4 w-64 animate-pulse rounded bg-white/15" />
    <div className="h-3 w-48 animate-pulse rounded bg-white/10" />
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-white/10" />
      ))}
    </div>
  </div>
);

const FooterEvent: FC = async () => {
  await connection();
  const summary = await getExhibitorSummary();

  if (!summary) {
    return (
      <p className="text-sm text-white/70">
        Exhibitor data not synced yet. Trigger the scraper to populate it.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-white">
          {summary.eventTitle} {formatYear(summary.startsAt)}
        </h2>
        <p className="mt-1 text-sm text-white/70">
          {summary.city && `${summary.city} · `}
          {formatDateRange(summary.startsAt, summary.endsAt)} ·{" "}
          {summary.shows
            .map((show) => `${show.exhibitorCount} at ${show.name}`)
            .join(" · ")}
        </p>
      </div>

      <div>
        <h3 className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          Top exhibitor countries
        </h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {summary.topCountries.map((country) => (
            <li
              key={country.name}
              className="rounded-full bg-white/10 px-3 py-1 text-sm text-white"
            >
              {country.name}{" "}
              <span className="text-white/60">{country.companyCount}</span>
            </li>
          ))}
        </ul>
      </div>

      {summary.logos.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {summary.logos.map((logo) => (
            <li
              key={logo.logoUrl}
              className="relative h-14 overflow-hidden rounded-lg bg-white p-2"
              title={logo.name}
            >
              <Image
                src={logo.logoUrl}
                alt={logo.name}
                fill
                sizes="(min-width: 1024px) 120px, 30vw"
                className="object-contain p-2"
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-white/60">
        Exhibitor data: MMI Connect · {summary.totalExhibitors} exhibitors ·
        last synced {formatDateTime(summary.lastSyncedAt)}
      </p>
    </div>
  );
};

export default FooterEvent;
