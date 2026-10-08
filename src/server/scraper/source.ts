import "server-only";

import { gqlRequest } from "./client";
import { EVENT_SLUG, MAX_PAGES, PAGE_SIZE } from "./consts";
import { EXHIBITOR_DETAIL_QUERY, EXHIBITOR_LIST_QUERY } from "./queries";
import {
  exhibitorDetailDataSchema,
  exhibitorListDataSchema,
  type ExhibitorDetail,
  type ExhibitorListItem,
} from "./schemas";

// MMI's `after` is an offset index: page n starts after item n * size - 1, and -1 means "from the start".
const offsetForPage = (page: number) => page * PAGE_SIZE - 1;

export const fetchAllExhibitors = async (
  onPage: (pagesFetched: number, totalCount: number) => Promise<void>,
): Promise<{ totalCount: number; exhibitors: ExhibitorListItem[] }> => {
  const byCustomerId = new Map<number, ExhibitorListItem>();
  let totalCount = 0;

  for (let page = 0; page < MAX_PAGES; page++) {
    const result = await gqlRequest(
      EXHIBITOR_LIST_QUERY,
      { group: EVENT_SLUG, first: PAGE_SIZE, after: offsetForPage(page) },
      exhibitorListDataSchema,
    );
    totalCount = result.totalCount;
    for (const exhibitor of result.exhibitors) {
      byCustomerId.set(exhibitor.mmiCustomerId, exhibitor);
    }
    await onPage(page + 1, totalCount);

    if (result.exhibitors.length === 0 || byCustomerId.size >= totalCount) {
      break;
    }
  }

  if (byCustomerId.size < totalCount) {
    throw new Error(
      `Pagination incomplete: collected ${byCustomerId.size} of ${totalCount} exhibitors`,
    );
  }
  return { totalCount, exhibitors: [...byCustomerId.values()] };
};

export const fetchExhibitorDetail = (
  exhibitor: ExhibitorListItem,
): Promise<ExhibitorDetail | null> =>
  gqlRequest(
    EXHIBITOR_DETAIL_QUERY,
    { userId: exhibitor.mmiUserId, showId: exhibitor.show.id },
    exhibitorDetailDataSchema,
  );
