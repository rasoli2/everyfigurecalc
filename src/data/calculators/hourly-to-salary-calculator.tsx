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
import { formatUSD, parseNumber, round } from "@/lib/calc/number";

type Direction = "to-salary" | "to-hourly";

function HourlyToSalaryCalculator() {
  const [direction, setDirection] = useState<Direction>("to-salary");
  const [amount, setAmount] = useState("24.50");
  const [hoursPerWeek, setHoursPerWeek] = useState("40");
  const [weeksPerYear, setWeeksPerYear] = useState("52");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ label: string; value: string; rows: { label: string; value: string }[] } | null>(
    null,
  );

  function calculate() {
    const value = parseNumber(amount);
    const hours = parseNumber(hoursPerWeek);
    const weeks = parseNumber(weeksPerYear);

    if (value === null || hours === null || weeks === null) {
      setResult(null);
      setError("Fill in the pay, the hours per week and the weeks per year.");
      return;
    }
    if (value < 0) {
      setResult(null);
      setError("Pay cannot be negative.");
      return;
    }
    if (hours <= 0 || weeks <= 0) {
      setResult(null);
      setError("Hours per week and weeks per year must be greater than zero.");
      return;
    }
    if (hours > 168) {
      setResult(null);
      setError("A week only has 168 hours.");
      return;
    }

    const annualHours = hours * weeks;

    if (direction === "to-salary") {
      const annual = value * annualHours;
      setError(null);
      setResult({
        label: "Annual salary",
        value: formatUSD(round(annual, 2)),
        rows: [
          { label: "Monthly", value: formatUSD(round(annual / 12, 2)) },
          { label: "Every two weeks", value: formatUSD(round(value * hours * 2, 2)) },
          { label: "Weekly", value: formatUSD(round(value * hours, 2)) },
          { label: "Paid hours per year", value: `${round(annualHours, 2)}` },
        ],
      });
      return;
    }

    const hourly = value / annualHours;
    setError(null);
    setResult({
      label: "Hourly rate",
      value: `${formatUSD(round(hourly, 2))} / h`,
      rows: [
        { label: "Weekly", value: formatUSD(round(value / weeks, 2)) },
        { label: "Monthly", value: formatUSD(round(value / 12, 2)) },
        { label: "Paid hours per year", value: `${round(annualHours, 2)}` },
      ],
    });
  }

  function reset() {
    setDirection("to-salary");
    setAmount("24.50");
    setHoursPerWeek("40");
    setWeeksPerYear("52");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="hs-direction" label="Convert">
          <SelectControl
            id="hs-direction"
            value={direction}
            onChange={(value) => {
              setDirection(value);
              setAmount(value === "to-salary" ? "24.50" : "51000");
              setResult(null);
              setError(null);
            }}
            options={[
              { value: "to-salary", label: "Hourly rate to annual salary" },
              { value: "to-hourly", label: "Annual salary to hourly rate" },
            ]}
          />
        </Field>
        <Field id="hs-amount" label={direction === "to-salary" ? "Hourly rate ($)" : "Annual salary ($)"}>
          <TextControl id="hs-amount" type="number" min="0" step="0.01" inputMode="decimal" value={amount} onChange={setAmount} />
        </Field>
        <FieldRow>
          <Field id="hs-hours" label="Hours per week">
            <TextControl id="hs-hours" type="number" min="0" step="0.5" inputMode="decimal" value={hoursPerWeek} onChange={setHoursPerWeek} />
          </Field>
          <Field id="hs-weeks" label="Paid weeks per year" hint="Use 52 for salaried work, or fewer for seasonal or unpaid-leave schedules.">
            <TextControl id="hs-weeks" type="number" min="0" step="1" inputMode="numeric" value={weeksPerYear} onChange={setWeeksPerYear} hint />
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
  slug: "hourly-to-salary-calculator",
  name: "Hourly to Salary Calculator",
  heading: "Hourly to Salary Calculator",
  category: "money",
  featured: true,
  blurb: "Convert an hourly rate to a salary, or a salary to an hourly rate.",
  seoTitle: "Hourly to Salary Calculator - Convert Pay Both Ways",
  seoDescription:
    "Convert an hourly wage into an annual, monthly, biweekly and weekly salary, or turn a salary back into an hourly rate using your own hours per week.",
  keywords: ["hourly to yearly", "annual salary", "wage to salary", "salary to hourly", "biweekly pay"],
  intro:
    "Comparing an hourly job to a salaried one only works if both are on the same footing.",
  notes: [
    "These are gross figures, before any deductions.",
    "Salaried roles include paid time off inside the 52 weeks. Hourly roles often do not, so reduce the paid weeks to compare honestly.",
  ],
  faq: [
    {
      question: "Why is 2,080 the standard number of work hours in a year?",
      answer: "It is 40 hours a week multiplied by 52 weeks, with paid holidays and vacation treated as paid time.",
    },
    {
      question: "How do biweekly and semi-monthly pay differ?",
      answer:
        "Biweekly means every two weeks, so 26 paychecks a year. Semi-monthly means twice a month, so 24 slightly larger ones. The annual total is the same.",
    },
  ],
  related: ["raise-calculator", "overtime-calculator", "hours-worked-calculator", "percentage-calculator"],
  Component: HourlyToSalaryCalculator,
};
