import type { FC } from "react";
import { connection } from "next/server";
import { MapPinIcon } from "lucide-react";

import { getExhibitorSummary } from "@server/repositories/exhibitor.repo";
import { formatDateRange, formatYear } from "@utils/date";

import type { TopBarShellProps } from "./type";

const TopBarShell: FC<TopBarShellProps> = ({ children }) => (
  <div className="bg-navy text-white">
    <p className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-2 text-xs sm:px-6 sm:text-sm">
      <MapPinIcon size={14} className="shrink-0 text-white/70" aria-hidden />
      <span className="truncate">{children}</span>
    </p>
  </div>
);

export const TopBarSkeleton: FC = () => (
  <TopBarShell>
    <span className="inline-block h-3 w-72 animate-pulse rounded bg-white/20 align-middle" />
  </TopBarShell>
);

const TopBar: FC = async () => {
  await connection();
  const summary = await getExhibitorSummary();

  if (!summary) {
    return <TopBarShell>Exhibitor data not synced yet</TopBarShell>;
  }

  const year = formatYear(summary.startsAt);
  const dates = formatDateRange(summary.startsAt, summary.endsAt);
  const reach = `${summary.totalExhibitors} exhibitors from ${summary.countryCount} countries`;
  const booth = summary.cavliBooth;

  return (
    <TopBarShell>
      {booth ? (
        <>
          <strong className="font-semibold">
            Cavli at {booth.showName} {year}
          </strong>
          {booth.hall && ` · Hall ${booth.hall}`}
          {booth.boothCode && ` · Booth ${booth.boothCode}`}
          <span className="hidden md:inline">
            {` · ${dates}`}
            {summary.city && ` · ${summary.city}`}
            {` · one of ${reach}`}
          </span>
        </>
      ) : (
        <>
          <strong className="font-semibold">
            {summary.eventTitle} {year}
          </strong>
          <span className="hidden md:inline">
            {` · ${dates}`}
            {summary.city && ` · ${summary.city}`}
          </span>
          {` · ${reach}`}
        </>
      )}
    </TopBarShell>
  );
};

export default TopBar;
