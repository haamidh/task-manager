const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
};

const localFormatter = new Intl.DateTimeFormat("en-GB", DATE_OPTIONS);
const utcFormatter = new Intl.DateTimeFormat("en-GB", {
  ...DATE_OPTIONS,
  timeZone: "UTC",
});

/**
 * Formats a due date as e.g. "31 Dec 2026".
 * Due dates are calendar days stored as midnight UTC, so they are formatted
 * in UTC to show the day the user picked in every time zone.
 */
export function formatDueDate(iso: string): string {
  return utcFormatter.format(new Date(iso));
}

/** Formats a timestamp (e.g. createdAt) as a date in the user's time zone. */
export function formatTimestamp(iso: string): string {
  return localFormatter.format(new Date(iso));
}
