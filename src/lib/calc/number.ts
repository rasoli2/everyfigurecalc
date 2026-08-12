/** Numeric helpers shared by the money and everyday calculators. */

export function round(value: number, dp = 2): number {
  const factor = 10 ** dp;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function formatNumber(value: number, dp = 2): string {
  return round(value, dp).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: dp,
  });
}

export function formatUSD(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Parses a user-typed number, tolerating commas, spaces and a leading $ or %. */
export function parseNumber(raw: string): number | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw.trim().replace(/[$,%\s]/g, "").replace(/,/g, "");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Parses a whitespace/comma/newline separated list of numbers. */
export function parseNumberList(raw: string): number[] | null {
  const tokens = raw.split(/[\s,;]+/).filter(Boolean);
  if (tokens.length === 0) return null;
  const values: number[] = [];
  for (const token of tokens) {
    const value = Number(token);
    if (!Number.isFinite(value)) return null;
    values.push(value);
  }
  return values;
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x || 1;
}

export interface Fraction {
  numerator: number;
  denominator: number;
}

/** Reduces a fraction and keeps the sign on the numerator. */
export function simplify({ numerator, denominator }: Fraction): Fraction {
  if (denominator === 0) throw new Error("Denominator cannot be zero");
  const divisor = gcd(numerator, denominator);
  const sign = denominator < 0 ? -1 : 1;
  return { numerator: (numerator / divisor) * sign, denominator: Math.abs(denominator / divisor) };
}

export function formatFraction({ numerator, denominator }: Fraction): string {
  if (numerator === 0) return "0";
  if (denominator === 1) return String(numerator);
  return `${numerator}/${denominator}`;
}

/** "2 3/4" style mixed number, or a plain fraction when it is already proper. */
export function formatMixed({ numerator, denominator }: Fraction): string {
  if (denominator === 1 || numerator === 0) return formatFraction({ numerator, denominator });
  const whole = Math.trunc(numerator / denominator);
  const remainder = Math.abs(numerator % denominator);
  if (whole === 0) return `${numerator}/${denominator}`;
  if (remainder === 0) return String(whole);
  return `${whole} ${remainder}/${denominator}`;
}

export function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1]! + sorted[middle]!) / 2 : sorted[middle]!;
}

export function modes(values: number[]): number[] {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const max = Math.max(...counts.values());
  if (max === 1) return [];
  return [...counts.entries()].filter(([, count]) => count === max).map(([value]) => value);
}
