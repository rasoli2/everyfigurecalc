import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  TextControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import { formatUSD, parseNumber, round } from "@/lib/calc/number";

function OvertimeCalculator() {
  const [hours, setHours] = useState("46");
  const [rate, setRate] = useState("22");
  const [threshold, setThreshold] = useState("40");
  const [multiplier, setMultiplier] = useState("1.5");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    regularHours: number;
    overtimeHours: number;
    regularPay: number;
    overtimePay: number;
    total: number;
    overtimeRate: number;
  } | null>(null);

  function calculate() {
    const worked = parseNumber(hours);
    const hourly = parseNumber(rate);
    const limit = parseNumber(threshold);
    const factor = parseNumber(multiplier);

    if (worked === null || hourly === null || limit === null || factor === null) {
      setResult(null);
      setError("Fill in hours worked, hourly rate, the overtime threshold and the multiplier.");
      return;
    }
    if (worked < 0 || hourly < 0 || limit < 0) {
      setResult(null);
      setError("Hours, rate and threshold cannot be negative.");
      return;
    }
    if (factor < 1) {
      setResult(null);
      setError("The overtime multiplier should be 1 or higher — 1.5 for time and a half.");
      return;
    }

    const regularHours = Math.min(worked, limit);
    const overtimeHours = Math.max(worked - limit, 0);
    const overtimeRate = hourly * factor;
    const regularPay = regularHours * hourly;
    const overtimePay = overtimeHours * overtimeRate;

    setError(null);
    setResult({
      regularHours: round(regularHours, 2),
      overtimeHours: round(overtimeHours, 2),
      regularPay: round(regularPay, 2),
      overtimePay: round(overtimePay, 2),
      total: round(regularPay + overtimePay, 2),
      overtimeRate: round(overtimeRate, 2),
    });
  }

  function reset() {
    setHours("46");
    setRate("22");
    setThreshold("40");
    setMultiplier("1.5");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="ot-hours" label="Hours worked in the week">
            <TextControl id="ot-hours" type="number" min="0" step="0.01" inputMode="decimal" value={hours} onChange={setHours} />
          </Field>
          <Field id="ot-rate" label="Regular hourly rate">
            <TextControl id="ot-rate" type="number" min="0" step="0.01" inputMode="decimal" value={rate} onChange={setRate} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="ot-threshold" label="Overtime starts after (hours)">
            <TextControl id="ot-threshold" type="number" min="0" step="0.5" inputMode="decimal" value={threshold} onChange={setThreshold} />
          </Field>
          <Field id="ot-multiplier" label="Overtime multiplier" hint="1.5 is time and a half, 2 is double time.">
            <TextControl id="ot-multiplier" type="number" min="1" step="0.1" inputMode="decimal" value={multiplier} onChange={setMultiplier} hint />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Total gross pay"
            value={formatUSD(result.total)}
            rows={[
              { label: `Regular (${result.regularHours} h)`, value: formatUSD(result.regularPay) },
              { label: `Overtime (${result.overtimeHours} h)`, value: formatUSD(result.overtimePay) },
              { label: "Overtime rate", value: `${formatUSD(result.overtimeRate)} / h` },
            ]}
            note={
              result.overtimeHours === 0
                ? "No overtime this week — the hours are at or below the threshold."
                : undefined
            }
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "overtime-calculator",
  name: "Overtime Calculator",
  heading: "Overtime Calculator",
  category: "work-pay",
  featured: true,
  blurb: "Split regular and overtime hours and see the pay for each.",
  seoTitle: "Overtime Calculator - Time and a Half Pay Calculator",
  seoDescription:
    "Work out overtime pay from weekly hours: regular hours, overtime hours, the time-and-a-half rate and total gross pay for the week.",
  keywords: ["time and a half", "overtime pay", "double time", "40 hour week", "ot pay"],
  intro:
    "Enter the hours you worked this week and your regular rate.",
  notes: [
    "The result is gross pay, before any deductions.",
  ],
  faq: [
    {
      question: "How is time and a half calculated?",
      answer:
        "Multiply the regular hourly rate by 1.5, then multiply by the overtime hours. At $22 an hour, overtime pays $33 an hour.",
    },
  ],
  related: ["hours-worked-calculator", "time-card-calculator", "hourly-to-salary-calculator", "shift-calculator"],
  Component: OvertimeCalculator,
};
