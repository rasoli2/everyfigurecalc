import { useState } from "react";
import {
  CalcForm,
  DateControl,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import { countWeekdays, daysBetween, parseDate, todayISODate } from "@/lib/calc/date";
import { round } from "@/lib/calc/number";

function DaysBetweenDatesCalculator() {
  const [from, setFrom] = useState("2025-01-01");
  const [to, setTo] = useState(todayISODate());
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    remainder: number;
    weekdays: number;
  } | null>(null);

  function calculate() {
    const start = parseDate(from);
    const end = parseDate(to);
    if (!start || !end) {
      setResult(null);
      setError("Enter two valid dates.");
      return;
    }

    const raw = daysBetween(start, end);
    const days = Math.abs(raw);
    const earlier = raw < 0 ? end : start;
    const later = raw < 0 ? start : end;

    setError(null);
    setResult({
      days,
      weeks: Math.floor(days / 7),
      remainder: days % 7,
      weekdays: countWeekdays(earlier, later),
    });
  }

  function reset() {
    setFrom("2025-01-01");
    setTo(todayISODate());
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="db-from" label="First date">
            <DateControl id="db-from" value={from} onChange={setFrom} />
          </Field>
          <Field id="db-to" label="Second date" hint="Order does not matter — the gap is always positive.">
            <DateControl id="db-to" value={to} onChange={setTo} hint />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Days between"
            value={`${result.days.toLocaleString("en-US")} days`}
            rows={[
              { label: "Weeks and days", value: `${result.weeks} weeks, ${result.remainder} days` },
              { label: "Including both dates", value: `${(result.days + 1).toLocaleString("en-US")} days` },
              { label: "Weekdays (Mon-Fri)", value: `${result.weekdays.toLocaleString("en-US")} days` },
              { label: "Months (approx.)", value: `${round(result.days / 30.4375, 1)}` },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "days-between-dates-calculator",
  name: "Days Between Dates Calculator",
  heading: "Days Between Dates Calculator",
  category: "time-date",
  featured: true,
  blurb: "Count the days, weeks and weekdays between two dates.",
  seoTitle: "Days Between Dates Calculator - Count Days & Weekdays",
  seoDescription:
    "Count how many days are between two dates, plus the total in weeks, the inclusive count and the number of weekdays from Monday to Friday.",
  keywords: ["date difference", "how many days until", "days since", "business days", "weeks between dates"],
  intro:
    "Enter two dates to see the gap between them.",
  notes: [
    "Leap days are included: 2024-02-01 to 2024-03-01 is 29 days.",
    "The weekday count does not subtract holidays.",
  ],
  faq: [
    {
      question: "Should I use the inclusive or exclusive count?",
      answer:
        "Use the plain day count for durations such as interest or shipping time. Use the inclusive count when both endpoints are being counted, like vacation days where the first and last day are both time off.",
    },
    {
      question: "Are business days the same as weekdays here?",
      answer:
        "The tool counts Monday to Friday only. It does not subtract holidays, so a week containing a holiday still shows five weekdays.",
    },
  ],
  related: ["date-calculator", "age-calculator", "time-duration-calculator", "average-calculator"],
  Component: DaysBetweenDatesCalculator,
};
