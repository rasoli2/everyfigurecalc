/** Date helpers. Dates are handled as UTC midnight so results never shift with timezone. */

export const MS_PER_DAY = 86_400_000;

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1]!;
}

/** Parses "YYYY-MM-DD" (the native date input format) into a UTC Date, or null. */
export function parseDate(raw: string): Date | null {
  if (typeof raw !== "string") return null;
  const match = raw.trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return new Date(Date.UTC(year, month - 1, day));
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Today's calendar date in the user's local timezone as "YYYY-MM-DD". */
export function todayISODate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Whole days from a to b. Negative when b is earlier than a. */
export function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / MS_PER_DAY);
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

/** Adds months, clamping to the last valid day (Jan 31 + 1 month = Feb 28/29). */
export function addMonths(date: Date, months: number): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + months;
  const targetYear = year + Math.floor(month / 12);
  const targetMonth = ((month % 12) + 12) % 12;
  const day = Math.min(date.getUTCDate(), daysInMonth(targetYear, targetMonth + 1));
  return new Date(Date.UTC(targetYear, targetMonth, day));
}

export function addYears(date: Date, years: number): Date {
  return addMonths(date, years * 12);
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function weekdayName(date: Date): string {
  return WEEKDAYS[date.getUTCDay()]!;
}

/** "Monday, March 3, 2025" */
export function formatDateLong(date: Date): string {
  return `${weekdayName(date)}, ${MONTHS[date.getUTCMonth()]!} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

/** Whole weekdays (Mon-Fri) between two dates, counting the start day, excluding the end day. */
export function countWeekdays(start: Date, end: Date): number {
  const total = daysBetween(start, end);
  if (total <= 0) return 0;
  let count = 0;
  for (let i = 0; i < total; i += 1) {
    const day = addDays(start, i).getUTCDay();
    if (day !== 0 && day !== 6) count += 1;
  }
  return count;
}

export interface AgeParts {
  years: number;
  months: number;
  days: number;
  totalDays: number;
}

/** Calendar age from `birth` to `on`. Assumes on >= birth. */
export function ageParts(birth: Date, on: Date): AgeParts {
  let years = on.getUTCFullYear() - birth.getUTCFullYear();
  let months = on.getUTCMonth() - birth.getUTCMonth();
  let days = on.getUTCDate() - birth.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonthYear = months < 0 ? on.getUTCFullYear() - 1 : on.getUTCFullYear();
    const prevMonth = ((on.getUTCMonth() - 1 + 12) % 12) + 1;
    days += daysInMonth(prevMonthYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days, totalDays: daysBetween(birth, on) };
}

/** Formats an ISO "YYYY-MM-DD" string as US "MM/DD/YYYY". Returns "" when invalid. */
export function formatUSDateInput(iso: string): string {
  const date = parseDate(iso);
  if (!date) return "";
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${mm}/${dd}/${date.getUTCFullYear()}`;
}

/** Parses US "MM/DD/YYYY" (slashes optional while typing) into ISO "YYYY-MM-DD", or null. */
export function parseUSDateInput(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const iso = `${digits.slice(4, 8)}-${digits.slice(0, 2)}-${digits.slice(2, 4)}`;
  return parseDate(iso) ? iso : null;
}

/** Progressive MM/DD/YYYY mask for typed input. */
export function maskUSDateInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}
