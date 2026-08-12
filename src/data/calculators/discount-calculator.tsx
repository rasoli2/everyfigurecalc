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

function DiscountCalculator() {
  const [price, setPrice] = useState("89.99");
  const [percent, setPercent] = useState("25");
  const [tax, setTax] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    sale: number;
    saved: number;
    withTax: number | null;
  } | null>(null);

  function calculate() {
    const original = parseNumber(price);
    const off = parseNumber(percent);
    if (original === null || off === null) {
      setResult(null);
      setError("Enter the original price and the discount percentage.");
      return;
    }
    if (original < 0) {
      setResult(null);
      setError("The original price cannot be negative.");
      return;
    }
    if (off < 0 || off > 100) {
      setResult(null);
      setError("The discount must be between 0 and 100 percent.");
      return;
    }

    const saved = (original * off) / 100;
    const sale = original - saved;

    let withTax: number | null = null;
    if (tax.trim() !== "") {
      const taxRate = parseNumber(tax);
      if (taxRate === null || taxRate < 0) {
        setResult(null);
        setError("Enter a valid sales tax percentage, or leave it blank.");
        return;
      }
      withTax = round(sale * (1 + taxRate / 100), 2);
    }

    setError(null);
    setResult({ sale: round(sale, 2), saved: round(saved, 2), withTax });
  }

  function reset() {
    setPrice("89.99");
    setPercent("25");
    setTax("");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="di-price" label="Original price ($)">
            <TextControl id="di-price" type="number" min="0" step="0.01" inputMode="decimal" value={price} onChange={setPrice} />
          </Field>
          <Field id="di-percent" label="Discount (%)">
            <TextControl id="di-percent" type="number" min="0" max="100" step="0.1" inputMode="decimal" value={percent} onChange={setPercent} />
          </Field>
        </FieldRow>
        <Field id="di-tax" label="Sales tax (%, optional)" hint="If you enter a sales tax rate, it is applied to the discounted price.">
          <TextControl id="di-tax" type="number" min="0" step="0.01" inputMode="decimal" placeholder="e.g. 8.25" value={tax} onChange={setTax} hint />
        </Field>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Sale price"
            value={formatUSD(result.sale)}
            rows={[
              { label: "You save", value: formatUSD(result.saved) },
              ...(result.withTax !== null ? [{ label: "With sales tax", value: formatUSD(result.withTax) }] : []),
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "discount-calculator",
  name: "Discount Calculator",
  heading: "Discount Calculator",
  category: "money",
  featured: true,
  blurb: "Sale price and real savings from any percentage off.",
  seoTitle: "Discount Calculator - Sale Price and Savings",
  seoDescription:
    "Find the sale price and the amount you save from any percentage discount, with optional sales tax applied to the discounted total.",
  keywords: ["percent off", "sale price", "how much do I save", "black friday", "markdown"],
  intro:
    "Enter the ticket price and the percentage off to see what you will actually pay and how much you keep.",
  notes: [
    "Stacked discounts are not additive: 20% off and then a further 10% off is 28% off in total, not 30%. Run the tool twice, using the first sale price as the second original price.",
    "Money values are rounded to the cent for display, so a stacked calculation may differ by a penny from the register.",
  ],
  faq: [
    {
      question: "How do I work out the percentage off if I only know both prices?",
      answer:
        "Divide the amount saved by the original price and multiply by 100. The Percentage Calculator does this directly with its percentage-change mode.",
    },
  ],
  related: ["percentage-calculator", "raise-calculator", "ratio-calculator", "average-calculator"],
  Component: DiscountCalculator,
};
