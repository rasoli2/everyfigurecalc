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
  addMonths,
  addYears,
  daysBetween,
  formatDateLong,
  formatUSDateInput,
  parseDate,
  toISODate,
  todayISODate,
  weekdayName,
} from "@/lib/calc/date";

type Unit = "days" | "weeks" | "months" | "years";
type Operation = "add" | "subtract";

function DateCalculator() {
  const [start, setStart] = useState(todayISODate());
  const [operation, setOperation] = useState<Operation>("add");
  const [amount, setAmount] = useState("30");
  const [unit, setUnit] = useState<Unit>("days");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Date | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);

  function calculate() {
    const from = parseDate(start);
    if (!from) {
      setResult(null);
      setError("Enter a valid start date.");
      return;
    }
    const value = Number(amount);
    if (amount.trim() === "" || !Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
      setResult(null);
      setError("Enter a whole number of days, weeks, months or years.");
      return;
    }

    const signed = operation === "add" ? value : -value;
    const target =
      unit === "days"
        ? addDays(from, signed)
        : unit === "weeks"
          ? addDays(from, signed * 7)
          : unit === "months"
            ? addMonths(from, signed)
            : addYears(from, signed);

    setError(null);
    setStartDate(from);
    setResult(target);
  }

  function reset() {
    setStart(todayISODate());
    setOperation("add");
    setAmount("30");
    setUnit("days");
    setError(null);
    setResult(null);
    setStartDate(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="dc-start" label="Start date">
            <DateControl id="dc-start" value={start} onChange={setStart} />
          </Field>
          <Field id="dc-op" label="Operation">
            <SelectControl
              id="dc-op"
              value={operation}
              onChange={setOperation}
              options={[
                { value: "add", label: "Add to date" },
                { value: "subtract", label: "Subtract from date" },
              ]}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="dc-amount" label="Amount">
            <TextControl
              id="dc-amount"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={amount}
              onChange={setAmount}
            />
          </Field>
          <Field id="dc-unit" label="Unit">
            <SelectControl
              id="dc-unit"
              value={unit}
              onChange={setUnit}
              options={[
                { value: "days", label: "Days" },
                { value: "weeks", label: "Weeks" },
                { value: "months", label: "Months" },
                { value: "years", label: "Years" },
              ]}
            />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result && startDate ? (
          <ResultPanel
            label="Resulting date"
            value={formatUSDateInput(toISODate(result))}
            rows={[
              { label: "Written out", value: formatDateLong(result) },
              { label: "Day of week", value: weekdayName(result) },
              { label: "Days from start", value: `${daysBetween(startDate, result)} days` },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "date-calculator",
  name: "Date Calculator",
  heading: "Date Calculator",
  category: "time-date",
  featured: true,
  blurb: "Add or subtract days, weeks, months or years from a date.",
  seoTitle: "Date Calculator - Add or Subtract Days, Weeks, Months",
  seoDescription:
    "Add or subtract days, weeks, months or years from any date. See the resulting calendar date, its day of the week and the total days moved.",
  keywords: ["add days to date", "date plus days", "due date", "deadline calculator", "90 days from today"],
  intro:
    "Use this when you need the date a set period before or after another date — a 30-day deadline, a 90-day return window or a six-month review.",
  howToUse: [
    "Days and weeks are added as fixed amounts: one week is always seven days.",
    "Months and years shift the calendar position instead of adding a fixed day count, because months differ in length.",
    "When the original day number does not exist in the target month, the result is clamped to that month's last day.",
  ],
  notes: [
    "January 31 plus one month gives February 28, or February 29 in a leap year.",
    "Leap days are counted automatically when adding days across February.",
  ],
  faq: [
    {
      question: "Why is January 31 plus one month not March 3?",
      answer:
        "Adding a month means moving to the same day number in the next month. February has no 31st, so the result is clamped to the last day of February — the convention used by contracts and most software.",
    },
    {
      question: "Does it count the start date?",
      answer:
        "No. Adding 1 day to March 1 gives March 2. If you need to count both endpoints of a range, use the Days Between Dates Calculator, which shows inclusive and exclusive totals.",
    },
  ],
  related: ["days-between-dates-calculator", "age-calculator", "time-calculator", "time-duration-calculator"],
  Component: DateCalculator,
};
