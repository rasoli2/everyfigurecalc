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
import { formatNumber, gcd, parseNumber, round } from "@/lib/calc/number";

type Mode = "simplify" | "solve";

function RatioCalculator() {
  const [mode, setMode] = useState<Mode>("simplify");
  const [a, setA] = useState("16");
  const [b, setB] = useState("10");
  const [c, setC] = useState("24");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; value: string; rows: { label: string; value: string }[] } | null>(
    null,
  );

  function calculate() {
    const x = parseNumber(a);
    const y = parseNumber(b);
    if (x === null || y === null) {
      setResult(null);
      setError("Enter both parts of the ratio.");
      return;
    }
    if (x === 0 || y === 0) {
      setResult(null);
      setError("Neither part of a ratio can be zero.");
      return;
    }

    if (mode === "simplify") {
      const scale = Number.isInteger(x) && Number.isInteger(y) ? gcd(x, y) : 1;
      const simpleA = x / scale;
      const simpleB = y / scale;
      setError(null);
      setResult({
        label: "Simplified ratio",
        value: `${formatNumber(simpleA, 4)} : ${formatNumber(simpleB, 4)}`,
        rows: [
          { label: "As a decimal", value: formatNumber(x / y, 6) },
          { label: "First as a share of total", value: `${formatNumber((x / (x + y)) * 100, 2)}%` },
          { label: "Second as a share of total", value: `${formatNumber((y / (x + y)) * 100, 2)}%` },
          { label: "Scaled to 1", value: `1 : ${formatNumber(y / x, 4)}` },
        ],
      });
      return;
    }

    const known = parseNumber(c);
    if (known === null) {
      setResult(null);
      setError("Enter the third value so the missing one can be solved.");
      return;
    }
    const missing = (known * y) / x;
    setError(null);
    setResult({
      label: "Missing value",
      value: formatNumber(missing, 6),
      rows: [
        { label: "Proportion", value: `${formatNumber(x, 4)} : ${formatNumber(y, 4)} = ${formatNumber(known, 4)} : ${formatNumber(missing, 4)}` },
        { label: "Scale factor", value: `x${formatNumber(known / x, 6)}` },
        { label: "Ratio as a decimal", value: formatNumber(x / y, 6) },
      ],
    });
  }

  function reset() {
    setMode("simplify");
    setA("16");
    setB("10");
    setC("24");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="rt-mode" label="What do you need?">
          <SelectControl
            id="rt-mode"
            value={mode}
            onChange={(value) => {
              setMode(value);
              setResult(null);
              setError(null);
            }}
            options={[
              { value: "simplify", label: "Simplify a ratio A : B" },
              { value: "solve", label: "Solve A : B = C : ?" },
            ]}
          />
        </Field>
        <FieldRow cols={mode === "solve" ? 3 : 2}>
          <Field id="rt-a" label="A">
            <TextControl id="rt-a" type="number" step="any" inputMode="decimal" value={a} onChange={setA} />
          </Field>
          <Field id="rt-b" label="B">
            <TextControl id="rt-b" type="number" step="any" inputMode="decimal" value={b} onChange={setB} />
          </Field>
          {mode === "solve" ? (
            <Field id="rt-c" label="C">
              <TextControl id="rt-c" type="number" step="any" inputMode="decimal" value={c} onChange={setC} />
            </Field>
          ) : null}
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? <ResultPanel label={result.label} value={result.value} rows={result.rows} /> : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "ratio-calculator",
  name: "Ratio Calculator",
  heading: "Ratio Calculator",
  category: "everyday",
  featured: true,
  blurb: "Simplify a ratio or scale it up to find a missing value.",
  seoTitle: "Ratio Calculator - Simplify and Scale Ratios",
  seoDescription:
    "Simplify a ratio to its lowest terms or solve a proportion of the form A : B = C : ? — with shares as percentages and the decimal equivalent.",
  keywords: ["simplify ratio", "proportion", "scale recipe", "mix ratio", "equivalent ratios"],
  intro:
    "Two jobs in one tool: reduce a ratio like 16:10 to something readable, or scale a known ratio up and down to find the number you are missing.",
  notes: [
    "Decimal ratios are accepted but only whole-number ratios can be reduced, so 2.5 : 4 is reported as entered.",
    "Zero is rejected in either position, because a ratio with a zero part has no meaningful proportion.",
  ],
  faq: [
    {
      question: "What is the difference between a ratio and a fraction?",
      answer:
        "A ratio compares two parts to each other (2 : 3), while a fraction compares one part to the whole (2/5). The share percentages here bridge the two.",
    },
    {
      question: "How do I scale a recipe with three ingredients?",
      answer:
        "Solve one pair at a time using the same scale factor. Once you know the factor, multiply every ingredient by it.",
    },
  ],
  related: ["fraction-calculator", "aspect-ratio-calculator", "percentage-calculator", "unit-conversion-calculator"],
  Component: RatioCalculator,
};
