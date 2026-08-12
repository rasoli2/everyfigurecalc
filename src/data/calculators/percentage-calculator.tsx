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
import { formatNumber, parseNumber, round } from "@/lib/calc/number";

type Mode = "of" | "is-what-percent" | "change";

function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("80");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; value: string; rows: { label: string; value: string }[] } | null>(
    null,
  );

  const labels: Record<Mode, { a: string; b: string }> = {
    of: { a: "Percentage (%)", b: "Of this number" },
    "is-what-percent": { a: "This number", b: "Is what percent of" },
    change: { a: "Original value", b: "New value" },
  };

  function calculate() {
    const x = parseNumber(a);
    const y = parseNumber(b);
    if (x === null || y === null) {
      setResult(null);
      setError("Fill in both numbers.");
      return;
    }

    if (mode === "of") {
      const value = (x / 100) * y;
      setError(null);
      setResult({
        label: `${formatNumber(x, 4)}% of ${formatNumber(y, 4)}`,
        value: formatNumber(value, 4),
        rows: [
          { label: "As a decimal factor", value: formatNumber(x / 100, 4) },
          { label: "Remaining amount", value: formatNumber(y - value, 4) },
        ],
      });
      return;
    }

    if (mode === "is-what-percent") {
      if (y === 0) {
        setResult(null);
        setError("You cannot take a percentage of zero — the second number must not be 0.");
        return;
      }
      const percent = (x / y) * 100;
      setError(null);
      setResult({
        label: `${formatNumber(x, 4)} out of ${formatNumber(y, 4)}`,
        value: `${formatNumber(percent, 4)}%`,
        rows: [
          { label: "As a decimal", value: formatNumber(x / y, 6) },
          { label: "As a fraction", value: `${formatNumber(x, 4)}/${formatNumber(y, 4)}` },
        ],
      });
      return;
    }

    if (x === 0) {
      setResult(null);
      setError("Percentage change from zero is undefined. Use the second mode to compare the two values instead.");
      return;
    }
    const change = ((y - x) / Math.abs(x)) * 100;
    setError(null);
    setResult({
      label: change >= 0 ? "Percentage increase" : "Percentage decrease",
      value: `${change >= 0 ? "+" : ""}${formatNumber(change, 4)}%`,
      rows: [
        { label: "Absolute change", value: formatNumber(y - x, 4) },
        { label: "New value as % of original", value: `${formatNumber((y / x) * 100, 4)}%` },
      ],
    });
  }

  function reset() {
    setMode("of");
    setA("15");
    setB("80");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="pc-mode" label="What do you want to work out?">
          <SelectControl
            id="pc-mode"
            value={mode}
            onChange={(value) => {
              setMode(value);
              setResult(null);
              setError(null);
            }}
            options={[
              { value: "of", label: "What is X% of Y?" },
              { value: "is-what-percent", label: "X is what percent of Y?" },
              { value: "change", label: "Percentage change from X to Y" },
            ]}
          />
        </Field>
        <FieldRow>
          <Field id="pc-a" label={labels[mode].a}>
            <TextControl id="pc-a" type="number" step="any" inputMode="decimal" value={a} onChange={setA} />
          </Field>
          <Field id="pc-b" label={labels[mode].b}>
            <TextControl id="pc-b" type="number" step="any" inputMode="decimal" value={b} onChange={setB} />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? <ResultPanel label={result.label} value={result.value} rows={result.rows} /> : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "percentage-calculator",
  name: "Percentage Calculator",
  heading: "Percentage Calculator",
  category: "money",
  featured: true,
  blurb: "Percent of a number, percent of a total, or percent change.",
  seoTitle: "Percentage Calculator - Percent Of, Change and Share",
  seoDescription:
    "Three percentage calculations in one tool: what is X% of Y, X is what percent of Y, and the percentage increase or decrease between two values.",
  keywords: ["percent of", "percentage increase", "percentage decrease", "percent change", "what percent"],
  intro:
    "Most percentage questions are one of three shapes.",
  notes: [
    "Percentage change is not symmetric. Going from 100 to 120 is +20%, but 120 back to 100 is -16.6667%.",
    "Change from zero is undefined and is reported as an error rather than as infinity.",
  ],
  faq: [
    {
      question: "What is the difference between percentage points and percent?",
      answer:
        "A rate moving from 5% to 7% is a rise of 2 percentage points, but a 40% increase. Both are correct — they answer different questions.",
    },
    {
      question: "How do I remove a percentage that has already been added?",
      answer:
        "Divide rather than subtract. To strip 8% tax from $108, divide by 1.08 to get $100. Subtracting 8% would leave $99.36.",
    },
  ],
  related: ["discount-calculator", "raise-calculator", "ratio-calculator", "average-calculator"],
  Component: PercentageCalculator,
};
