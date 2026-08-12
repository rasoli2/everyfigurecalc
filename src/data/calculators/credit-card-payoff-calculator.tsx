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

interface Payoff {
  months: number;
  totalPaid: number;
  interestPaid: number;
  finalPayment: number;
}

/** Amortises a fixed monthly payment against a balance. Returns null when the payment never clears it. */
function simulatePayoff(balance: number, annualRate: number, payment: number): Payoff | null {
  const monthlyRate = annualRate / 100 / 12;
  let remaining = balance;
  let interestPaid = 0;
  let totalPaid = 0;
  let months = 0;
  let finalPayment = payment;

  while (remaining > 0) {
    const interest = remaining * monthlyRate;
    if (payment <= interest + 0.005) return null;
    const due = remaining + interest;
    const thisPayment = Math.min(payment, round(due, 2));
    interestPaid += interest;
    totalPaid += thisPayment;
    remaining = due - thisPayment;
    months += 1;
    finalPayment = thisPayment;
    if (months > 1200) return null;
  }

  return {
    months,
    totalPaid: round(totalPaid, 2),
    interestPaid: round(interestPaid, 2),
    finalPayment: round(finalPayment, 2),
  };
}

function CreditCardPayoffCalculator() {
  const [balance, setBalance] = useState("4200");
  const [apr, setApr] = useState("22.99");
  const [payment, setPayment] = useState("200");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Payoff | null>(null);

  function calculate() {
    const owed = parseNumber(balance);
    const rate = parseNumber(apr);
    const monthly = parseNumber(payment);

    if (owed === null || rate === null || monthly === null) {
      setResult(null);
      setError("Enter the balance, the APR and your monthly payment.");
      return;
    }
    if (owed <= 0) {
      setResult(null);
      setError("Enter a balance greater than zero.");
      return;
    }
    if (rate < 0 || rate > 100) {
      setResult(null);
      setError("Enter an APR between 0 and 100.");
      return;
    }
    if (monthly <= 0) {
      setResult(null);
      setError("Enter a monthly payment greater than zero.");
      return;
    }

    const payoff = simulatePayoff(owed, rate, monthly);
    if (!payoff) {
      const minimumToClear = round((owed * (rate / 100 / 12)) + 1, 2);
      setResult(null);
      setError(
        `A payment of ${formatUSD(monthly)} does not cover the monthly interest, so the balance would never clear. Try at least ${formatUSD(minimumToClear)}.`,
      );
      return;
    }

    setError(null);
    setResult(payoff);
  }

  function reset() {
    setBalance("4200");
    setApr("22.99");
    setPayment("200");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="cc-balance" label="Current balance ($)">
            <TextControl id="cc-balance" type="number" min="0" step="0.01" inputMode="decimal" value={balance} onChange={setBalance} />
          </Field>
          <Field id="cc-apr" label="APR (%)">
            <TextControl id="cc-apr" type="number" min="0" step="0.01" inputMode="decimal" value={apr} onChange={setApr} />
          </Field>
        </FieldRow>
        <Field id="cc-payment" label="Monthly payment ($)" hint="Assumes the same amount every month and no new purchases.">
          <TextControl id="cc-payment" type="number" min="0" step="0.01" inputMode="decimal" value={payment} onChange={setPayment} hint />
        </Field>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Time to pay off"
            value={
              result.months < 12
                ? `${result.months} month${result.months === 1 ? "" : "s"}`
                : `${Math.floor(result.months / 12)} yr ${result.months % 12} mo`
            }
            rows={[
              { label: "Total payments", value: `${result.months}` },
              { label: "Total interest", value: formatUSD(result.interestPaid) },
              { label: "Total paid", value: formatUSD(result.totalPaid) },
              { label: "Final payment", value: formatUSD(result.finalPayment) },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "credit-card-payoff-calculator",
  name: "Credit Card Payoff Calculator",
  heading: "Credit Card Payoff Calculator",
  category: "money",
  blurb: "How long a fixed monthly payment takes to clear a balance.",
  seoTitle: "Credit Card Payoff Calculator - Months and Interest",
  seoDescription:
    "See how long it takes to pay off a credit card at a fixed monthly payment, plus the total interest you will pay before the balance clears.",
  keywords: ["credit card interest", "pay off debt", "APR", "minimum payment", "debt payoff time"],
  intro:
    "Enter what you owe, your card's APR and the amount you can pay each month.",
  howToUse: [
    "The APR is divided by 12 to get the monthly interest rate.",
    "Each month, interest is added to the balance, then your payment is subtracted.",
    "The loop repeats until the balance reaches zero. The final payment is trimmed to whatever is left, which is usually less than a full payment.",
  ],
  notes: [
    "Monthly interest comes from the annual APR you enter, divided by 12.",
    "The model assumes no new purchases, no fees and a fixed payment. Real statements vary if you keep using the card.",
    "If your payment does not cover the monthly interest, the balance grows forever. The calculator says so instead of returning a number.",
  ],
  faq: [
    {
      question: "Why does paying the minimum take so long?",
      answer:
        "A minimum payment is often only 1-2% of the balance plus interest, so very little goes to principal. Raising the payment by even $50 a month can cut years off the payoff.",
    },
    {
      question: "Is APR the same as the interest I pay?",
      answer:
        "APR is the yearly rate. The monthly rate is APR divided by 12, so a 22.99% APR costs about 1.92% of the balance each month.",
    },
  ],
  related: ["percentage-calculator", "raise-calculator", "hourly-to-salary-calculator", "discount-calculator"],
  Component: CreditCardPayoffCalculator,
};
