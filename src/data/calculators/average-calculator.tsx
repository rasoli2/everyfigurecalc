import { useState } from "react";
import {
  CalcForm,
  Field,
  ResultPanel,
  ResultSlot,
  TextAreaControl,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import { formatNumber, mean, median, modes, parseNumberList } from "@/lib/calc/number";

function AverageCalculator() {
  const [values, setValues] = useState("88, 92, 79, 95, 84");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    count: number;
    sum: number;
    mean: number;
    median: number;
    modes: number[];
    min: number;
    max: number;
  } | null>(null);

  function calculate() {
    const parsed = parseNumberList(values);
    if (!parsed) {
      setResult(null);
      setError("Enter numbers separated by commas, spaces or new lines.");
      return;
    }

    setError(null);
    setResult({
      count: parsed.length,
      sum: parsed.reduce((total, value) => total + value, 0),
      mean: mean(parsed),
      median: median(parsed),
      modes: modes(parsed),
      min: Math.min(...parsed),
      max: Math.max(...parsed),
    });
  }

  function reset() {
    setValues("88, 92, 79, 95, 84");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <Field id="av-values" label="Your numbers" hint="Separate them with commas, spaces or new lines.">
          <TextAreaControl id="av-values" value={values} onChange={setValues} rows={4} placeholder="88, 92, 79, 95, 84" />
        </Field>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Average (mean)"
            value={formatNumber(result.mean, 6)}
            rows={[
              { label: "Count", value: `${result.count}` },
              { label: "Sum", value: formatNumber(result.sum, 6) },
              { label: "Median", value: formatNumber(result.median, 6) },
              { label: "Mode", value: result.modes.length ? result.modes.map((m) => formatNumber(m, 4)).join(", ") : "No repeated value" },
              { label: "Smallest", value: formatNumber(result.min, 6) },
              { label: "Largest", value: formatNumber(result.max, 6) },
              { label: "Range", value: formatNumber(result.max - result.min, 6) },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "average-calculator",
  name: "Average Calculator",
  heading: "Average Calculator",
  category: "everyday",
  featured: true,
  blurb: "Mean, median, mode and range for any list of numbers.",
  seoTitle: "Average Calculator - Mean, Median, Mode and Range",
  seoDescription:
    "Paste a list of numbers to get the mean average, median, mode, sum, count, smallest and largest values and the range.",
  keywords: ["mean", "median", "mode", "average grade", "range of numbers"],
  intro:
    "Paste or type your numbers in any format — commas, spaces or one per line.",
  howToUse: [
    "The mean is the sum of all values divided by how many there are.",
    "The median is the middle value once sorted, or the average of the two middle values when the count is even.",
    "The mode is the value that appears most often; if nothing repeats, no mode is reported.",
  ],
  notes: [
    "Negative numbers and decimals are both accepted.",
    "A list with no repeated value has no mode, and a list where several values tie reports all of them.",
  ],
  faq: [
    {
      question: "Should I use the mean or the median?",
      answer:
        "Use the mean for evenly spread data. Use the median when a few very high or very low values would distort it, such as house prices or salaries.",
    },
    {
      question: "What is a weighted average?",
      answer:
        "One where some values count for more, like a final exam worth 40% of a grade. Repeat each value according to its weight before pasting the list.",
    },
  ],
  related: ["percentage-calculator", "fraction-calculator", "ratio-calculator", "days-between-dates-calculator"],
  Component: AverageCalculator,
};
