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
import { formatFraction, formatMixed, formatNumber, simplify } from "@/lib/calc/number";

type Op = "add" | "subtract" | "multiply" | "divide";

function parseInt10(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const value = Number(trimmed);
  return Number.isInteger(value) ? value : null;
}

function FractionCalculator() {
  const [n1, setN1] = useState("3");
  const [d1, setD1] = useState("4");
  const [op, setOp] = useState<Op>("add");
  const [n2, setN2] = useState("5");
  const [d2, setD2] = useState("6");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ numerator: number; denominator: number } | null>(null);

  function calculate() {
    const a = parseInt10(n1);
    const b = parseInt10(d1);
    const c = parseInt10(n2);
    const d = parseInt10(d2);

    if (a === null || b === null || c === null || d === null) {
      setResult(null);
      setError("All four values must be whole numbers.");
      return;
    }
    if (b === 0 || d === 0) {
      setResult(null);
      setError("A denominator cannot be zero.");
      return;
    }
    if (op === "divide" && c === 0) {
      setResult(null);
      setError("You cannot divide by a fraction whose value is zero.");
      return;
    }

    const raw =
      op === "add"
        ? { numerator: a * d + c * b, denominator: b * d }
        : op === "subtract"
          ? { numerator: a * d - c * b, denominator: b * d }
          : op === "multiply"
            ? { numerator: a * c, denominator: b * d }
            : { numerator: a * d, denominator: b * c };

    setError(null);
    setResult(simplify(raw));
  }

  function reset() {
    setN1("3");
    setD1("4");
    setOp("add");
    setN2("5");
    setD2("6");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="fr-n1" label="First numerator">
            <TextControl id="fr-n1" type="number" step="1" inputMode="numeric" value={n1} onChange={setN1} />
          </Field>
          <Field id="fr-d1" label="First denominator">
            <TextControl id="fr-d1" type="number" step="1" inputMode="numeric" value={d1} onChange={setD1} />
          </Field>
        </FieldRow>
        <Field id="fr-op" label="Operation">
          <SelectControl
            id="fr-op"
            value={op}
            onChange={setOp}
            options={[
              { value: "add", label: "Add (+)" },
              { value: "subtract", label: "Subtract (-)" },
              { value: "multiply", label: "Multiply (x)" },
              { value: "divide", label: "Divide (÷)" },
            ]}
          />
        </Field>
        <FieldRow>
          <Field id="fr-n2" label="Second numerator">
            <TextControl id="fr-n2" type="number" step="1" inputMode="numeric" value={n2} onChange={setN2} />
          </Field>
          <Field id="fr-d2" label="Second denominator">
            <TextControl id="fr-d2" type="number" step="1" inputMode="numeric" value={d2} onChange={setD2} />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Result in lowest terms"
            value={formatFraction(result)}
            rows={[
              { label: "Mixed number", value: formatMixed(result) },
              { label: "Decimal", value: formatNumber(result.numerator / result.denominator, 6) },
              { label: "Percent", value: `${formatNumber((result.numerator / result.denominator) * 100, 4)}%` },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "fraction-calculator",
  name: "Fraction Calculator",
  heading: "Fraction Calculator",
  category: "everyday",
  featured: true,
  blurb: "Add, subtract, multiply or divide two fractions.",
  seoTitle: "Fraction Calculator - Add, Subtract, Multiply, Divide",
  seoDescription:
    "Calculate with two fractions and get the answer in lowest terms, as a mixed number, as a decimal and as a percent.",
  keywords: ["add fractions", "simplify fractions", "mixed number", "lowest terms", "divide fractions"],
  intro:
    "Enter two fractions and pick an operation.",
  notes: [
    "Negative fractions are supported. The sign is normalized onto the numerator, so -1/2 and 1/-2 give the same answer.",
    "A zero denominator is rejected, as is dividing by a fraction that equals zero.",
  ],
  faq: [
    {
      question: "How do I convert a mixed number for this calculator?",
      answer:
        "Multiply the whole number by the denominator and add the numerator. 2 1/3 becomes 7/3, since 2 x 3 + 1 = 7.",
    },
    {
      question: "What does lowest terms mean?",
      answer:
        "Both parts are divided by their greatest common divisor, so 8/12 becomes 2/3. The value is unchanged, just written as simply as possible.",
    },
  ],
  related: ["ratio-calculator", "percentage-calculator", "average-calculator", "aspect-ratio-calculator"],
  Component: FractionCalculator,
};
