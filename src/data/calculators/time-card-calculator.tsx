import { useState } from "react";
import {
  ErrorMessage,
  ResultPanel,
  ResultSlot,
  SelectControl,
  TimeControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  durationMinutes,
  formatDuration,
  parseTime,
  toDecimalHours,
  type TimeFormat,
} from "@/lib/calc/time";
import { formatUSD, parseNumber, round } from "@/lib/calc/number";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

interface Row {
  start: string;
  end: string;
  breakMinutes: string;
}

const emptyRow: Row = { start: "", end: "", breakMinutes: "" };

function initialRows(): Row[] {
  return DAYS.map((_, index) =>
    index < 5 ? { start: "09:00", end: "17:30", breakMinutes: "30" } : { ...emptyRow },
  );
}

function TimeCardCalculator() {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [rate, setRate] = useState("");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    perDay: { day: string; minutes: number }[];
    total: number;
    pay: number | null;
  } | null>(null);

  function update(index: number, patch: Partial<Row>) {
    setRows((current) => current.map((row, i) => (i === index ? { ...row, ...patch } : row)));
  }

  function calculate() {
    const perDay: { day: string; minutes: number }[] = [];
    let total = 0;

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index]!;
      const day = DAYS[index]!;
      const hasStart = row.start.trim() !== "";
      const hasEnd = row.end.trim() !== "";
      if (!hasStart && !hasEnd) continue;

      const start = parseTime(row.start);
      const end = parseTime(row.end);
      if (start === null || end === null) {
        setResult(null);
        setError(`${day} needs both a start and an end time, or neither.`);
        return;
      }
      const unpaid = row.breakMinutes.trim() === "" ? 0 : Number(row.breakMinutes);
      if (!Number.isFinite(unpaid) || unpaid < 0) {
        setResult(null);
        setError(`${day} has an invalid break length.`);
        return;
      }
      const worked = durationMinutes(start, end);
      if (unpaid > worked) {
        setResult(null);
        setError(`${day}: the break is longer than the shift.`);
        return;
      }
      const paid = worked - unpaid;
      perDay.push({ day, minutes: paid });
      total += paid;
    }

    if (perDay.length === 0) {
      setResult(null);
      setError("Fill in at least one day.");
      return;
    }

    let pay: number | null = null;
    if (rate.trim() !== "") {
      const hourly = parseNumber(rate);
      if (hourly === null || hourly < 0) {
        setResult(null);
        setError("Enter a valid hourly rate, or leave it blank.");
        return;
      }
      pay = round((hourly * total) / 60, 2);
    }

    setError(null);
    setResult({ perDay, total, pay });
  }

  function reset() {
    setRows(initialRows());
    setRate("");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <form
        className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          calculate();
        }}
        noValidate
      >
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[30rem] border-collapse text-sm">
            <caption className="sr-only">Weekly time card: start time, end time and unpaid break for each day</caption>
            <thead>
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="pb-2 pr-3 font-semibold">
                  Day
                </th>
                <th scope="col" className="pb-2 pr-3 font-semibold">
                  Start
                </th>
                <th scope="col" className="pb-2 pr-3 font-semibold">
                  End
                </th>
                <th scope="col" className="pb-2 font-semibold">
                  Break (min)
                </th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, index) => {
                const row = rows[index]!;
                return (
                  <tr key={day} className="border-t border-border">
                    <th scope="row" className="py-2 pr-3 text-left font-medium">
                      {day}
                    </th>
                    <td className="py-2 pr-3">
                      <label className="sr-only" htmlFor={`card-${day}-start`}>
                        {day} start time
                      </label>
                      <TimeControl
                        id={`card-${day}-start`}
                        value={row.start}
                        onChange={(value) => update(index, { start: value })}
                        format={timeFormat}
                        className="min-w-28 px-2"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <label className="sr-only" htmlFor={`card-${day}-end`}>
                        {day} end time
                      </label>
                      <TimeControl
                        id={`card-${day}-end`}
                        value={row.end}
                        onChange={(value) => update(index, { end: value })}
                        format={timeFormat}
                        className="min-w-28 px-2"
                      />
                    </td>
                    <td className="py-2">
                      <label className="sr-only" htmlFor={`card-${day}-break`}>
                        {day} unpaid break in minutes
                      </label>
                      <input
                        id={`card-${day}-break`}
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={row.breakMinutes}
                        onChange={(event) => update(index, { breakMinutes: event.target.value })}
                        className="h-11 w-full min-w-20 rounded-md border border-input bg-background px-2 text-base"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 max-w-xs">
          <label htmlFor="card-format" className="block text-sm font-medium">
            Time format
          </label>
          <div className="mt-1.5">
            <SelectControl
              id="card-format"
              value={timeFormat}
              onChange={setTimeFormat}
              options={[
                { value: "12", label: "12-hour (AM/PM)" },
                { value: "24", label: "24-hour" },
              ]}
            />
          </div>
        </div>

        <div className="mt-4 max-w-xs">
          <label htmlFor="card-rate" className="block text-sm font-medium">
            Hourly rate (optional)
          </label>
          <input
            id="card-rate"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="e.g. 21.00"
            value={rate}
            onChange={(event) => setRate(event.target.value)}
            className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-base"
          />
        </div>

        {error ? <ErrorMessage>{error}</ErrorMessage> : null}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="submit"
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 sm:flex-none"
          >
            Calculate week
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border border-input bg-card px-5 text-sm font-semibold hover:bg-secondary sm:flex-none"
          >
            Reset
          </button>
        </div>
      </form>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Weekly total"
            value={formatDuration(result.total)}
            rows={[
              { label: "Decimal hours", value: `${toDecimalHours(result.total)} h` },
              ...result.perDay.map((entry) => ({ label: entry.day, value: formatDuration(entry.minutes) })),
              ...(result.pay !== null ? [{ label: "Gross pay", value: formatUSD(result.pay) }] : []),
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "time-card-calculator",
  name: "Time Card Calculator",
  heading: "Time Card Calculator",
  category: "work-pay",
  featured: true,
  blurb: "Add up a full week of clock-in and clock-out times.",
  seoTitle: "Time Card Calculator - Weekly Hours and Pay Totals",
  seoDescription:
    "Free weekly time card calculator. Enter start, end and break times for each day to get daily totals, weekly hours in decimal form and gross pay.",
  keywords: ["timesheet calculator", "weekly hours", "time sheet", "payroll week", "daily totals"],
  intro:
    "Fill in the days you worked and leave the rest blank.",
  notes: [
    "That day's unpaid break minutes are subtracted before it is added to the weekly total.",
    "Gross pay uses the weekly minute total, so no cents are lost to daily rounding.",
    "Blank rows are skipped. A row with only one time filled in shows an error instead of a guess.",
    "An overnight shift counts toward the day it started on.",
  ],
  faq: [
    {
      question: "What if I worked two separate shifts in one day?",
      answer:
        "Total the second shift with the Hours Worked Calculator and add its minutes to that day as a negative break, or record it on an unused row — the weekly total is the same either way.",
    },
    {
      question: "Does the week have to start on Monday?",
      answer:
        "No. The day labels are only there for orientation. If your pay week runs Sunday to Saturday, use the rows in whatever order suits you.",
    },
  ],
  related: ["hours-worked-calculator", "overtime-calculator", "decimal-hours-calculator", "shift-calculator"],
  Component: TimeCardCalculator,
};
