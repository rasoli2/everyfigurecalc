/** Time helpers. All internal time values are minutes from midnight (0-1439). */

export const MINUTES_PER_DAY = 1440;

/**
 * Parses a time string. Accepts 24-hour ("22:00", "9:05") and 12-hour
 * ("10:30 PM", "9am", "12:00 am") forms. Returns minutes from midnight,
 * or null when the input is empty or not a valid time.
 */
export function parseTime(raw: string): number | null {
  if (typeof raw !== "string") return null;
  const value = raw.trim().toLowerCase();
  if (!value) return null;

  const match = value.match(/^(\d{1,2})(?::(\d{1,2}))?(?::(\d{1,2}))?\s*(am|pm|a|p)?$/);
  if (!match) return null;

  let hours = Number(match[1]);
  const minutes = match[2] === undefined ? 0 : Number(match[2]);
  const meridiem = match[4];

  if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return null;
  if (minutes > 59) return null;

  if (meridiem) {
    if (hours < 1 || hours > 12) return null;
    const pm = meridiem.startsWith("p");
    if (hours === 12) hours = pm ? 12 : 0;
    else if (pm) hours += 12;
  } else if (hours > 23) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Elapsed minutes from start to end. Spans that end earlier than they start
 * are treated as crossing midnight (22:00 -> 06:00 is 480 minutes).
 * Identical times mean zero, not a full day.
 */
export function durationMinutes(startMinutes: number, endMinutes: number): number {
  const diff = endMinutes - startMinutes;
  return diff < 0 ? diff + MINUTES_PER_DAY : diff;
}

export function splitMinutes(total: number): { hours: number; minutes: number } {
  const sign = total < 0 ? -1 : 1;
  const abs = Math.abs(Math.round(total));
  return { hours: sign * Math.floor(abs / 60), minutes: sign * (abs % 60) };
}

/** "8h 05m" style label. */
export function formatDuration(total: number): string {
  const { hours, minutes } = splitMinutes(total);
  const negative = hours < 0 || minutes < 0;
  const h = Math.abs(hours);
  const m = Math.abs(minutes);
  return `${negative ? "-" : ""}${h}h ${String(m).padStart(2, "0")}m`;
}

/** Long form: "8 hours 5 minutes". */
export function formatDurationWords(total: number): string {
  const { hours, minutes } = splitMinutes(total);
  const parts: string[] = [];
  if (hours) parts.push(`${Math.abs(hours)} ${Math.abs(hours) === 1 ? "hour" : "hours"}`);
  if (minutes || !hours) parts.push(`${Math.abs(minutes)} ${Math.abs(minutes) === 1 ? "minute" : "minutes"}`);
  return `${total < 0 ? "minus " : ""}${parts.join(" ")}`;
}

export function toDecimalHours(total: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round((total / 60) * factor) / factor;
}

/** Formats minutes from midnight back to 12-hour clock time. */
export function formatClock12(minutes: number): string {
  const normalized = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h24 = Math.floor(normalized / 60);
  const m = normalized % 60;
  const meridiem = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${meridiem}`;
}

export function formatClock24(minutes: number): string {
  const normalized = ((Math.round(minutes) % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export type TimeFormat = "12" | "24";

/** Formats an internal "HH:MM" value for display in the chosen format. "" stays "". */
export function formatTimeInput(value: string, format: TimeFormat): string {
  const minutes = parseTime(value);
  if (minutes === null) return "";
  return format === "12" ? formatClock12(minutes) : formatClock24(minutes);
}

/** Normalizes typed text to the internal 24-hour "HH:MM" value, or "" when not a time. */
export function toTimeValue(raw: string): string {
  const minutes = parseTime(raw);
  return minutes === null ? "" : formatClock24(minutes);
}
