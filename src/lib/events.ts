// Event dates are stored as "YYYY-MM-DD" strings (from <input type="date">).
// Comparing them as strings against today's local date avoids the timezone
// trap of `new Date("2026-11-24")`, which parses as UTC midnight and would
// mark an event happening today as already past for anyone west of Greenwich.

export function localDateString(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

// An event is upcoming on its own day and before it. An unparseable or missing
// date is not upcoming: it must not be advertised as something to attend.
export function isUpcoming(date: string | undefined, now: Date = new Date()): boolean {
  if (!date || !/^\d{4}-\d{2}-\d{2}/.test(date)) return false;
  return date.slice(0, 10) >= localDateString(now);
}
