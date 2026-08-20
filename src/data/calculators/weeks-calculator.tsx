import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  DateControl,
  SelectControl,
  TextControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  addDays,
  formatUSDateInput,
  parseDate,
  toISODate,
  todayISODate,
  weekdayName,
} from "@/lib/calc/date";

type Operation = "add" | "subtract";

const WEEK_PRESETS = [1, 2, 4, 6, 8, 12] as const;

function WeeksCalculator() {
  const [start, setStart] = useState(todayISODate());
  const [operation, setOperation] = useState<Operation>("add");
  const [weeks, setWeeks] = useState("4");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ date: Date; totalDays: number } | null>(null);

  function calculate() {
    const from = parseDate(start);
    if (!from) {
      setResult(null);
      setError("Enter a valid start date.");
      return;
    }
    const value = Number(weeks);
    if (weeks.trim() === "" || !Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      setResult(null);
      setError("Enter a whole number of weeks, zero or more.");
      return;
    }

    const totalDays = value * 7;
    const signedDays = operation === "add" ? totalDays : -totalDays;
    setError(null);
    setResult({ date: addDays(from, signedDays), totalDays });
  }

  function reset() {
    setStart(todayISODate());
    setOperation("add");
    setWeeks("4");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="wc-start" label="Start date">
            <DateControl id="wc-start" value={start} onChange={setStart} />
          </Field>
          <Field id="wc-op" label="Operation">
            <SelectControl
              id="wc-op"
              value={operation}
              onChange={setOperation}
              options={[
                { value: "add", label: "Add weeks" },
                { value: "subtract", label: "Subtract weeks" },
              ]}
            />
          </Field>
        </FieldRow>
        <Field id="wc-weeks" label="Number of weeks">
          <TextControl
            id="wc-weeks"
            type="number"
            min="0"
            step="1"
            inputMode="numeric"
            value={weeks}
            onChange={setWeeks}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {WEEK_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setWeeks(String(preset))}
                className="inline-flex min-h-9 items-center rounded-md border-2 border-border-strong bg-card px-3 text-xs font-bold text-foreground transition-colors hover:border-primary hover:bg-accent"
              >
                {preset} week{preset === 1 ? "" : "s"}
              </button>
            ))}
          </div>
        </Field>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Result date"
            value={formatUSDateInput(toISODate(result.date))}
            rows={[
              { label: "Day of week", value: weekdayName(result.date) },
              {
                label: "Total days",
                value: `${result.totalDays} day${result.totalDays === 1 ? "" : "s"} ${operation === "add" ? "added" : "subtracted"}`,
              },
            ]}
          />
        ) : null}
      </ResultSlot>

      <section className="mt-8" aria-labelledby="weeks-how-to">
        <h2
          id="weeks-how-to"
          className="border-b-2 border-foreground pb-1.5 text-sm font-extrabold uppercase tracking-[0.12em] text-foreground"
        >
          How to Add or Subtract Weeks From a Date
        </h2>
        <div className="mt-3 space-y-3 text-sm text-foreground/80">
          <p>
            One week is always seven days. This calculator multiplies your number of weeks by seven, then moves the
            calendar date forward or backward by that many days.
          </p>
          <p>
            Month and year boundaries, including leap years, are handled automatically — you do not need to count days
            by hand.
          </p>
        </div>
        <ul className="mt-4 space-y-1.5 text-sm text-foreground/80">
          <li>1 week from 08/20/2026 = 08/27/2026</li>
          <li>4 weeks from 08/20/2026 = 09/17/2026</li>
          <li>2 weeks before 08/20/2026 = 08/06/2026</li>
        </ul>
      </section>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "weeks-calculator",
  name: "Weeks Calculator",
  heading: "Weeks Calculator",
  category: "time-date",
  blurb: "Add or subtract weeks from a date and see the resulting day.",
  seoTitle: "Weeks Calculator - Add or Subtract Weeks From a Date",
  seoDescription:
    "Add or subtract weeks from any date and instantly find the resulting date, day of the week and total days.",
  keywords: [
    "add weeks to date",
    "date plus weeks",
    "subtract weeks from date",
    "weeks from date",
    "week addition calculator",
  ],
  intro:
    "Add or subtract weeks from a starting date to find the resulting calendar date. Useful for deadlines, schedules, appointments and planning dates weeks ahead or behind.",
  related: ["date-calculator", "days-between-dates-calculator", "time-calculator"],
  Component: WeeksCalculator,
};
