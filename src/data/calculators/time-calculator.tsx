import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  SelectControl,
  TextControl,
  TimeControl,
  TimeFormatField,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  MINUTES_PER_DAY,
  formatClock12,
  formatClock24,
  parseTime,
  type TimeFormat,
} from "@/lib/calc/time";

type Operation = "add" | "subtract";

function TimeCalculator() {
  const [start, setStart] = useState("09:00");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12");
  const [operation, setOperation] = useState<Operation>("add");
  const [hours, setHours] = useState("2");
  const [minutes, setMinutes] = useState("30");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ total: number; dayShift: number } | null>(null);

  function calculate() {
    const startMinutes = parseTime(start);
    if (startMinutes === null) {
      setResult(null);
      setError("Enter a valid start time, for example 9:00 or 2:15 PM.");
      return;
    }
    const h = hours.trim() === "" ? 0 : Number(hours);
    const m = minutes.trim() === "" ? 0 : Number(minutes);
    if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || m < 0) {
      setResult(null);
      setError("Hours and minutes must be zero or a positive number.");
      return;
    }

    const offset = Math.round(h * 60 + m) * (operation === "add" ? 1 : -1);
    const raw = startMinutes + offset;
    const dayShift = Math.floor(raw / MINUTES_PER_DAY);
    setError(null);
    setResult({ total: raw, dayShift });
  }

  function reset() {
    setStart("09:00");
    setOperation("add");
    setHours("2");
    setMinutes("30");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="tc-start" label="Start time">
            <TimeControl id="tc-start" value={start} onChange={setStart} format={timeFormat} />
          </Field>
          <Field id="tc-op" label="Operation">
            <SelectControl
              id="tc-op"
              value={operation}
              onChange={setOperation}
              options={[
                { value: "add", label: "Add time" },
                { value: "subtract", label: "Subtract time" },
              ]}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="tc-hours" label="Hours">
            <TextControl
              id="tc-hours"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={hours}
              onChange={setHours}
            />
          </Field>
          <Field id="tc-minutes" label="Minutes">
            <TextControl
              id="tc-minutes"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={minutes}
              onChange={setMinutes}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <TimeFormatField id="tc-format" value={timeFormat} onChange={setTimeFormat} />
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Resulting time"
            value={formatClock12(result.total)}
            rows={[
              { label: "24-hour clock", value: formatClock24(result.total) },
              {
                label: "Day",
                value:
                  result.dayShift === 0
                    ? "Same day"
                    : result.dayShift > 0
                      ? `+${result.dayShift} day${result.dayShift > 1 ? "s" : ""}`
                      : `${result.dayShift} day${result.dayShift < -1 ? "s" : ""}`,
              },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "time-calculator",
  name: "Time Calculator",
  heading: "Time Calculator",
  category: "time-date",
  featured: true,
  blurb: "Add or subtract hours and minutes from a clock time.",
  seoTitle: "Time Calculator - Add or Subtract Hours and Minutes",
  seoDescription:
    "Add or subtract hours and minutes from any time and see the result on both a 12-hour and 24-hour clock, including when it crosses midnight.",
  keywords: ["add time", "subtract time", "clock math", "time plus hours", "what time will it be"],
  intro:
    "Pick a starting time, choose whether you are adding or subtracting, and enter the hours and minutes.",
  notes: [
    "Subtracting past midnight returns a time on the previous day, shown as -1 day.",
    "Minutes above 59 are allowed as input: 0 hours and 90 minutes is treated as 1 hour 30 minutes.",
  ],
  faq: [
    {
      question: "What happens when the answer passes midnight?",
      answer:
        "The clock time still shows correctly and the Day row tells you it moved forward or back by one or more days, so you never lose track of the calendar date.",
    },
    {
      question: "Can I enter times with AM and PM?",
      answer:
        "Yes. The calculator uses a 12-hour AM/PM clock by default. Enter times in the selected 12-hour or 24-hour format, and switch formats at any time.",
    },
  ],
  related: ["time-duration-calculator", "hours-worked-calculator", "shift-calculator", "date-calculator"],
  Component: TimeCalculator,
};
