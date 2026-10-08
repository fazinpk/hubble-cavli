export const MMI_GRAPHQL_URL = "https://mmiconnect.in/graphql";
export const EVENT_SLUG = "ep-blr-2026";

export const PAGE_SIZE = 100;
export const MAX_PAGES = 50;
export const DETAIL_BATCH_SIZE = 5;
export const BATCH_PAUSE_MS = 250;

export const REQUEST_TIMEOUT_MS = 15_000;
export const MAX_ATTEMPTS = 3;
export const RETRY_BASE_DELAY_MS = 1_000;

export const STALE_RUN_MS = 15 * 60 * 1000;
export const MIN_RESULT_RATIO = 0.5;

// MMI show dates have no offset; the event runs in Bengaluru.
export const SOURCE_TIMEZONE_OFFSET = "+05:30";

export const USER_AGENT = "cavli-hubble-scraper/0.1";
