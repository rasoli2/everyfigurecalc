import { useState } from "react";
import {
  CalcForm,
  DateControl,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  SelectControl,
  TextControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  addDays,
  daysBetween,
  formatUSDateInput,
  parseDate,
  toISODate,
  todayISODate,
  weekdayName,
} from "@/lib/calc/date";

type Mode = "between" | "add-subtract";
type Operation = "add" | "subtract";

const BUSINESS_DAY_PRESETS = [5, 10, 15, 20, 30] as const;
const WEEKDAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;

function isWeekday(date: Date): boolean {
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

function orderedRange(a: Date, b: Date): { earlier: Date; later: Date } {
  return daysBetween(a, b) < 0 ? { earlier: b, later: a } : { earlier: a, later: b };
}

function countDaysInRange(
  earlier: Date,
  later: Date,
  includeStart: boolean,
  includeEnd: boolean,
  predicate: (date: Date) => boolean,
): number {
  const span = daysBetween(earlier, later);
  if (span === 0) {
    return predicate(earlier) && (includeStart || includeEnd) ? 1 : 0;
  }

  let count = 0;
  for (let i = 0; i <= span; i += 1) {
    const date = addDays(earlier, i);
    const isStart = i === 0;
    const isEnd = i === span;
    if (isStart && !includeStart) continue;
    if (isEnd && !includeEnd) continue;
    if (predicate(date)) count += 1;
  }
  return count;
}

function weekdayBreakdown(
  earlier: Date,
  later: Date,
  includeStart: boolean,
  includeEnd: boolean,
): number[] {
  const counts = [0, 0, 0, 0, 0];
  const span = daysBetween(earlier, later);
  if (span === 0) {
    if ((includeStart || includeEnd) && isWeekday(earlier)) {
      counts[earlier.getUTCDay() - 1] = 1;
    }
    return counts;
  }

  for (let i = 0; i <= span; i += 1) {
    const date = addDays(earlier, i);
    const isStart = i === 0;
    const isEnd = i === span;
    if (isStart && !includeStart) continue;
    if (isEnd && !includeEnd) continue;
    const day = date.getUTCDay();
    if (day >= 1 && day <= 5) counts[day - 1]! += 1;
  }
  return counts;
}

function addBusinessDays(start: Date, businessDays: number): Date {
  if (businessDays === 0) return start;
  let current = start;
  let remaining = Math.abs(businessDays);
  const step = businessDays > 0 ? 1 : -1;
  while (remaining > 0) {
    current = addDays(current, step);
    if (isWeekday(current)) remaining -= 1;
  }
  return current;
}

function BusinessDaysCalculator() {
  const today = todayISODate();
  const [mode, setMode] = useState<Mode>("between");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [includeStart, setIncludeStart] = useState(true);
  const [includeEnd, setIncludeEnd] = useState(true);
  const [operation, setOperation] = useState<Operation>("add");
  const [businessDays, setBusinessDays] = useState("5");
  const [error, setError] = useState<string | null>(null);
  const [betweenResult, setBetweenResult] = useState<{
    businessDays: number;
    calendarDays: number;
    weekendDays: number;
    breakdown: number[];
  } | null>(null);
  const [adjustResult, setAdjustResult] = useState<{
    date: Date;
    businessDays: number;
    calendarDaysSpanned: number;
  } | null>(null);

  function calculateBetween() {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!start || !end) {
      setBetweenResult(null);
      setError("Enter two valid dates.");
      return;
    }

    const { earlier, later } = orderedRange(start, end);
    const business = countDaysInRange(earlier, later, includeStart, includeEnd, isWeekday);
    const calendar = countDaysInRange(earlier, later, includeStart, includeEnd, () => true);
    const weekend = countDaysInRange(
      earlier,
      later,
      includeStart,
      includeEnd,
      (date) => !isWeekday(date),
    );

    setAdjustResult(null);
    setError(null);
    setBetweenResult({
      businessDays: business,
      calendarDays: calendar,
      weekendDays: weekend,
      breakdown: weekdayBreakdown(earlier, later, includeStart, includeEnd),
    });
  }

  function calculateAdjust() {
    const start = parseDate(startDate);
    if (!start) {
      setAdjustResult(null);
      setError("Enter a valid start date.");
      return;
    }
    const value = Number(businessDays);
    if (businessDays.trim() === "" || !Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      setAdjustResult(null);
      setError("Enter a whole number of business days, zero or more.");
      return;
    }

    const signed = operation === "add" ? value : -value;
    const resultDate = addBusinessDays(start, signed);
    setBetweenResult(null);
    setError(null);
    setAdjustResult({
      date: resultDate,
      businessDays: value,
      calendarDaysSpanned: Math.abs(daysBetween(start, resultDate)),
    });
  }

  function calculate() {
    if (mode === "between") calculateBetween();
    else calculateAdjust();
  }

  function reset() {
    setMode("between");
    setStartDate(today);
    setEndDate(today);
    setIncludeStart(true);
    setIncludeEnd(true);
    setOperation("add");
    setBusinessDays("5");
    setError(null);
    setBetweenResult(null);
    setAdjustResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="bd-mode" label="Mode">
          <SelectControl
            id="bd-mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: "between", label: "Business days between dates" },
              { value: "add-subtract", label: "Add or subtract business days" },
            ]}
          />
        </Field>

        {mode === "between" ? (
          <>
            <FieldRow>
              <Field id="bd-start" label="Start date">
                <DateControl id="bd-start" value={startDate} onChange={setStartDate} />
              </Field>
              <Field id="bd-end" label="End date">
                <DateControl id="bd-end" value={endDate} onChange={setEndDate} />
              </Field>
            </FieldRow>
            <FieldRow>
              <Field id="bd-include-start" label="Include start date">
                <SelectControl
                  id="bd-include-start"
                  value={includeStart ? "yes" : "no"}
                  onChange={(value) => setIncludeStart(value === "yes")}
                  options={[
                    { value: "yes", label: "Include" },
                    { value: "no", label: "Exclude" },
                  ]}
                />
              </Field>
              <Field id="bd-include-end" label="Include end date">
                <SelectControl
                  id="bd-include-end"
                  value={includeEnd ? "yes" : "no"}
                  onChange={(value) => setIncludeEnd(value === "yes")}
                  options={[
                    { value: "yes", label: "Include" },
                    { value: "no", label: "Exclude" },
                  ]}
                />
              </Field>
            </FieldRow>
          </>
        ) : (
          <>
            <FieldRow>
              <Field id="bd-adjust-start" label="Start date">
                <DateControl id="bd-adjust-start" value={startDate} onChange={setStartDate} />
              </Field>
              <Field id="bd-op" label="Operation">
                <SelectControl
                  id="bd-op"
                  value={operation}
                  onChange={setOperation}
                  options={[
                    { value: "add", label: "Add business days" },
                    { value: "subtract", label: "Subtract business days" },
                  ]}
                />
              </Field>
            </FieldRow>
            <Field id="bd-count" label="Number of business days">
              <TextControl
                id="bd-count"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                value={businessDays}
                onChange={setBusinessDays}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {BUSINESS_DAY_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setBusinessDays(String(preset))}
                    className="inline-flex min-h-9 items-center rounded-md border-2 border-border-strong bg-card px-3 text-xs font-bold text-foreground transition-colors hover:border-primary hover:bg-accent"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        <p className="text-xs text-muted-foreground">
          Business days currently mean Monday through Friday. Public holidays are not excluded.
        </p>
      </CalcForm>

      <ResultSlot>
        {betweenResult ? (
          <ResultPanel
            label="Business days"
            value={`${betweenResult.businessDays.toLocaleString("en-US")}`}
            rows={[
              { label: "Calendar days", value: `${betweenResult.calendarDays.toLocaleString("en-US")}` },
              { label: "Weekend days", value: `${betweenResult.weekendDays.toLocaleString("en-US")}` },
              ...WEEKDAY_NAMES.map((name, index) => ({
                label: name,
                value: `${betweenResult.breakdown[index]!.toLocaleString("en-US")}`,
              })),
            ]}
          />
        ) : null}
        {adjustResult ? (
          <ResultPanel
            label="Result date"
            value={formatUSDateInput(toISODate(adjustResult.date))}
            rows={[
              { label: "Day of week", value: weekdayName(adjustResult.date) },
              {
                label: "Business days",
                value: `${adjustResult.businessDays} ${operation === "add" ? "added" : "subtracted"}`,
              },
              {
                label: "Calendar days spanned",
                value: `${adjustResult.calendarDaysSpanned.toLocaleString("en-US")}`,
              },
            ]}
          />
        ) : null}
      </ResultSlot>

      <section className="mt-8" aria-labelledby="business-days-how-to">
        <h2
          id="business-days-how-to"
          className="border-b-2 border-foreground pb-1.5 text-sm font-extrabold uppercase tracking-[0.12em] text-foreground"
        >
          How Business Days Are Calculated
        </h2>
        <div className="mt-3 space-y-3 text-sm text-foreground/80">
          <p>
            In this calculator, a business day means Monday through Friday. Saturdays and Sundays are always
            excluded from the count.
          </p>
          <p>
            Public holidays are not automatically excluded in this version. When you add or subtract business days,
            the tool skips weekends only and moves the calendar date forward or backward one weekday at a time.
          </p>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
          <li>Friday + 1 business day = Monday</li>
          <li>Monday + 5 business days = the following Monday</li>
          <li>Monday through Friday = 5 business days</li>
        </ul>
      </section>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "business-days-calculator",
  name: "Business Days Calculator",
  heading: "Business Days Calculator",
  category: "time-date",
  blurb: "Count weekdays between dates or add and subtract business days.",
  seoTitle: "Business Days Calculator - Weekdays Between Dates",
  seoDescription:
    "Count business days between two dates or add and subtract weekdays from a date. See weekday totals and skip Saturdays and Sundays automatically.",
  keywords: [
    "business days calculator",
    "weekdays between dates",
    "add business days to date",
    "subtract business days from date",
    "number of fridays between two dates",
  ],
  intro:
    "Count weekdays between two dates or add and subtract business days from a starting date. Saturdays and Sundays are skipped automatically.",
  related: ["weeks-calculator", "date-calculator", "days-between-dates-calculator"],
  Component: BusinessDaysCalculator,
};
