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
import { formatNumber, formatUSD, parseNumber, round } from "@/lib/calc/number";

type Basis = "hourly" | "annual";
type Given = "percent" | "amount";

function RaiseCalculator() {
  const [basis, setBasis] = useState<Basis>("annual");
  const [given, setGiven] = useState<Given>("percent");
  const [current, setCurrent] = useState("62000");
  const [value, setValue] = useState("4.5");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    newPay: number;
    increase: number;
    percent: number;
    perPeriod: string;
  } | null>(null);

  function calculate() {
    const currentPay = parseNumber(current);
    const entered = parseNumber(value);
    if (currentPay === null || entered === null) {
      setResult(null);
      setError("Enter your current pay and the raise.");
      return;
    }
    if (currentPay <= 0) {
      setResult(null);
      setError("Current pay must be greater than zero.");
      return;
    }

    const increase = given === "percent" ? (currentPay * entered) / 100 : entered;
    const newPay = currentPay + increase;
    if (newPay < 0) {
      setResult(null);
      setError("That reduction is larger than your current pay.");
      return;
    }
    const percent = (increase / currentPay) * 100;

    setError(null);
    setResult({
      newPay: round(newPay, 2),
      increase: round(increase, 2),
      percent: round(percent, 4),
      perPeriod:
        basis === "annual"
          ? `${formatUSD(round(newPay / 12, 2))} per month`
          : `${formatUSD(round(newPay * 2080, 2))} per year at 40 h/week`,
    });
  }

  function reset() {
    setBasis("annual");
    setGiven("percent");
    setCurrent("62000");
    setValue("4.5");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="ra-basis" label="Pay is quoted as">
            <SelectControl
              id="ra-basis"
              value={basis}
              onChange={setBasis}
              options={[
                { value: "annual", label: "Annual salary" },
                { value: "hourly", label: "Hourly rate" },
              ]}
            />
          </Field>
          <Field id="ra-given" label="I know the">
            <SelectControl
              id="ra-given"
              value={given}
              onChange={setGiven}
              options={[
                { value: "percent", label: "Raise percentage" },
                { value: "amount", label: "Raise amount in dollars" },
              ]}
            />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="ra-current" label={basis === "annual" ? "Current salary ($)" : "Current hourly rate ($)"}>
            <TextControl id="ra-current" type="number" min="0" step="0.01" inputMode="decimal" value={current} onChange={setCurrent} />
          </Field>
          <Field
            id="ra-value"
            label={given === "percent" ? "Raise (%)" : "Raise amount ($)"}
            hint="Enter a negative number to model a pay cut."
          >
            <TextControl id="ra-value" type="number" step="any" inputMode="decimal" value={value} onChange={setValue} hint />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label={basis === "annual" ? "New salary" : "New hourly rate"}
            value={formatUSD(result.newPay)}
            rows={[
              { label: "Increase", value: formatUSD(result.increase) },
              { label: "Increase as a percentage", value: `${formatNumber(result.percent, 4)}%` },
              { label: "Equivalent", value: result.perPeriod },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "raise-calculator",
  name: "Raise Calculator",
  heading: "Pay Raise Calculator",
  category: "money",
  featured: true,
  blurb: "See what a raise is worth as a percentage and in dollars.",
  seoTitle: "Raise Calculator - New Salary After a Pay Increase",
  seoDescription:
    "Calculate your new salary or hourly rate after a raise. Works from a percentage or a dollar amount and shows the increase both ways.",
  keywords: ["pay raise", "salary increase", "cost of living adjustment", "new salary", "percent raise"],
  intro:
    "A raise is quoted as a percentage sometimes and as a dollar figure other times.",
  notes: [
    "These are gross figures, before any deductions.",
    "The 2,080-hour year assumes 40 hours a week for 52 weeks with no unpaid time off.",
  ],
  faq: [
    {
      question: "Does a raise keep up with inflation?",
      answer:
        "Only if the percentage is at least as high as the inflation rate for the same period. Compare your raise percentage with the published CPI change to see whether your pay held its value.",
    },
  ],
  related: ["hourly-to-salary-calculator", "percentage-calculator", "overtime-calculator", "discount-calculator"],
  Component: RaiseCalculator,
};
