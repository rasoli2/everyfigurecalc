import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  SelectControl,
  TextControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import { formatDuration, splitMinutes, toDecimalHours } from "@/lib/calc/time";
import { parseNumber, round } from "@/lib/calc/number";

type Direction = "to-decimal" | "to-hours";

function DecimalHoursCalculator() {
  const [direction, setDirection] = useState<Direction>("to-decimal");
  const [hours, setHours] = useState("7");
  const [minutes, setMinutes] = useState("45");
  const [decimal, setDecimal] = useState("7.75");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; value: string; rows: { label: string; value: string }[] } | null>(
    null,
  );

  function calculate() {
    if (direction === "to-decimal") {
      const h = hours.trim() === "" ? 0 : Number(hours);
      const m = minutes.trim() === "" ? 0 : Number(minutes);
      if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || m < 0) {
        setResult(null);
        setError("Hours and minutes must be zero or a positive number.");
        return;
      }
      const total = h * 60 + m;
      setError(null);
      setResult({
        label: "Decimal hours",
        value: `${toDecimalHours(total)}`,
        rows: [
          { label: "Hours and minutes", value: formatDuration(total) },
          { label: "Total minutes", value: `${round(total, 2)} min` },
          { label: "Rounded to quarter hour", value: `${round(Math.round(total / 15) / 4, 2)}` },
        ],
      });
      return;
    }

    const value = parseNumber(decimal);
    if (value === null || value < 0) {
      setResult(null);
      setError("Enter a decimal number of hours, for example 7.75.");
      return;
    }
    const total = Math.round(value * 60);
    const parts = splitMinutes(total);
    setError(null);
    setResult({
      label: "Hours and minutes",
      value: formatDuration(total),
      rows: [
        { label: "Hours", value: `${parts.hours}` },
        { label: "Minutes", value: `${parts.minutes}` },
        { label: "Total minutes", value: `${total} min` },
      ],
    });
  }

  function reset() {
    setDirection("to-decimal");
    setHours("7");
    setMinutes("45");
    setDecimal("7.75");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="dh-direction" label="Convert">
          <SelectControl
            id="dh-direction"
            value={direction}
            onChange={(value) => {
              setDirection(value);
              setResult(null);
              setError(null);
            }}
            options={[
              { value: "to-decimal", label: "Hours and minutes to decimal" },
              { value: "to-hours", label: "Decimal to hours and minutes" },
            ]}
          />
        </Field>

        {direction === "to-decimal" ? (
          <FieldRow>
            <Field id="dh-hours" label="Hours">
              <TextControl id="dh-hours" type="number" min="0" step="1" inputMode="numeric" value={hours} onChange={setHours} />
            </Field>
            <Field id="dh-minutes" label="Minutes">
              <TextControl id="dh-minutes" type="number" min="0" step="1" inputMode="numeric" value={minutes} onChange={setMinutes} />
            </Field>
          </FieldRow>
        ) : (
          <Field id="dh-decimal" label="Decimal hours">
            <TextControl id="dh-decimal" type="number" min="0" step="0.01" inputMode="decimal" value={decimal} onChange={setDecimal} />
          </Field>
        )}
      </CalcForm>

      <ResultSlot>
        {result ? <ResultPanel label={result.label} value={result.value} rows={result.rows} /> : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "decimal-hours-calculator",
  name: "Decimal Hours Calculator",
  heading: "Decimal Hours Calculator",
  category: "work-pay",
  blurb: "Convert hours and minutes to decimal hours, and back again.",
  seoTitle: "Decimal Hours Calculator - Convert Minutes to Decimal",
  seoDescription:
    "Convert hours and minutes to decimal hours for payroll, or turn decimal hours back into hours and minutes. Includes quarter-hour rounding.",
  keywords: ["minutes to decimal", "payroll conversion", "0.25 hours", "quarter hour rounding", "hours to decimal"],
  intro:
    "Payroll systems want 7.75, timesheets say 7 hours 45 minutes.",
  notes: [
    "Common conversions: 15 minutes is 0.25, 20 minutes is 0.33, 40 minutes is 0.67, 50 minutes is 0.83.",
    "Two decimal places lose at most 18 seconds per entry, which is why payroll uses them as standard.",
  ],
  faq: [
    {
      question: "Why is 20 minutes 0.33 and not 0.2?",
      answer:
        "Because an hour has 60 minutes, not 100. 20 divided by 60 is 0.3333, which rounds to 0.33 at two decimal places.",
    },
  ],

  related: ["hours-worked-calculator", "time-card-calculator", "time-duration-calculator", "overtime-calculator"],
  Component: DecimalHoursCalculator,
};
