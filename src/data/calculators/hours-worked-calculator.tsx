import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  TextControl,
  TimeControl,
  TimeFormatField,
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

function HoursWorkedCalculator() {
  const [start, setStart] = useState("08:30");
  const [end, setEnd] = useState("17:00");
  const [breakMinutes, setBreakMinutes] = useState("30");
  const [rate, setRate] = useState("");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ paid: number; gross: number; pay: number | null } | null>(null);

  function calculate() {
    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    if (startMinutes === null || endMinutes === null) {
      setResult(null);
      setError("Enter a valid clock-in and clock-out time.");
      return;
    }
    const unpaid = breakMinutes.trim() === "" ? 0 : Number(breakMinutes);
    if (!Number.isFinite(unpaid) || unpaid < 0) {
      setResult(null);
      setError("Break minutes must be zero or more.");
      return;
    }

    const gross = durationMinutes(startMinutes, endMinutes);
    if (unpaid > gross) {
      setResult(null);
      setError("The break is longer than the shift itself. Check the times and break length.");
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
      pay = round((hourly * (gross - unpaid)) / 60, 2);
    }

    setError(null);
    setResult({ paid: gross - unpaid, gross, pay });
  }

  function reset() {
    setStart("08:30");
    setEnd("17:00");
    setBreakMinutes("30");
    setRate("");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="hw-start" label="Clock in">
            <TimeControl id="hw-start" value={start} onChange={setStart} format={timeFormat} />
          </Field>
          <Field id="hw-end" label="Clock out" hint="Overnight shifts are handled automatically.">
            <TimeControl id="hw-end" value={end} onChange={setEnd} format={timeFormat} hint />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="hw-break" label="Unpaid break (minutes)">
            <TextControl
              id="hw-break"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              value={breakMinutes}
              onChange={setBreakMinutes}
            />
          </Field>
          <Field id="hw-rate" label="Hourly rate (optional)">
            <TextControl
              id="hw-rate"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              placeholder="e.g. 22.50"
              value={rate}
              onChange={setRate}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <TimeFormatField id="hw-format" value={timeFormat} onChange={setTimeFormat} />
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Paid time"
            value={formatDuration(result.paid)}
            rows={[
              { label: "Decimal hours", value: `${toDecimalHours(result.paid)} h` },
              { label: "Time on site", value: formatDuration(result.gross) },
              ...(result.pay !== null ? [{ label: "Gross pay", value: formatUSD(result.pay) }] : []),
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "hours-worked-calculator",
  name: "Hours Worked Calculator",
  heading: "Hours Worked Calculator",
  category: "work-pay",
  featured: true,
  blurb: "Clock-in to clock-out, minus breaks, in hours and decimal hours.",
  seoTitle: "Hours Worked Calculator - Clock In, Clock Out, Breaks",
  seoDescription:
    "Calculate hours worked from clock-in and clock-out times, subtract unpaid breaks, and see the total in hours, minutes and decimal hours with optional gross pay.",
  keywords: ["work hours", "clock in clock out", "payroll hours", "hours and minutes worked", "break deduction"],
  intro:
    "Enter when you started, when you finished and how long your unpaid break was.",
  notes: [
    "Unpaid break minutes are subtracted to give paid time.",
    "Decimal hours are paid time divided by 60, rounded to two decimal places. Gross pay is the hourly rate multiplied by the unrounded paid hours.",
    "A break longer than the shift is rejected instead of producing negative hours.",
    "Paid breaks should be left out of the break field — only unpaid time is deducted.",
  ],
  faq: [
    {
      question: "How do I handle a shift that ends after midnight?",
      answer:
        "Enter the times as they appear on the clock — 10:00 PM to 6:00 AM, for example. The calculator recognizes the wrap and returns 8 hours rather than a negative figure.",
    },
    {
      question: "Why does payroll use 8.00 instead of 8h 00m?",
      answer:
        "Payroll multiplies hours by a rate, which needs a single decimal number. 30 minutes is 0.5 hours and 20 minutes is 0.33 hours after rounding.",
    },
  ],
  related: ["time-card-calculator", "overtime-calculator", "decimal-hours-calculator", "time-duration-calculator"],
  Component: HoursWorkedCalculator,
};
