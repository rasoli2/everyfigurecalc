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

type Solve = "height" | "width";

function AspectRatioCalculator() {
  const [ratioW, setRatioW] = useState("16");
  const [ratioH, setRatioH] = useState("9");
  const [solve, setSolve] = useState<Solve>("height");
  const [known, setKnown] = useState("1280");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ width: number; height: number; simple: string } | null>(null);

  function calculate() {
    const rw = parseNumber(ratioW);
    const rh = parseNumber(ratioH);
    const value = parseNumber(known);

    if (rw === null || rh === null || value === null) {
      setResult(null);
      setError("Enter both ratio numbers and the dimension you know.");
      return;
    }
    if (rw <= 0 || rh <= 0) {
      setResult(null);
      setError("Ratio values must be greater than zero.");
      return;
    }
    if (value <= 0) {
      setResult(null);
      setError("The known dimension must be greater than zero.");
      return;
    }

    const width = solve === "height" ? value : (value * rw) / rh;
    const height = solve === "height" ? (value * rh) / rw : value;
    const divisor = Number.isInteger(rw) && Number.isInteger(rh) ? gcd(rw, rh) : 1;

    setError(null);
    setResult({
      width: round(width, 4),
      height: round(height, 4),
      simple: `${formatNumber(rw / divisor, 4)}:${formatNumber(rh / divisor, 4)}`,
    });
  }

  function reset() {
    setRatioW("16");
    setRatioH("9");
    setSolve("height");
    setKnown("1280");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="ar-rw" label="Ratio width">
            <TextControl id="ar-rw" type="number" min="0" step="any" inputMode="decimal" value={ratioW} onChange={setRatioW} />
          </Field>
          <Field id="ar-rh" label="Ratio height">
            <TextControl id="ar-rh" type="number" min="0" step="any" inputMode="decimal" value={ratioH} onChange={setRatioH} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="ar-solve" label="I know the">
            <SelectControl
              id="ar-solve"
              value={solve}
              onChange={setSolve}
              options={[
                { value: "height", label: "Width (solve for height)" },
                { value: "width", label: "Height (solve for width)" },
              ]}
            />
          </Field>
          <Field id="ar-known" label={solve === "height" ? "Width (px)" : "Height (px)"}>
            <TextControl id="ar-known" type="number" min="0" step="any" inputMode="decimal" value={known} onChange={setKnown} />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Dimensions"
            value={`${formatNumber(result.width, 4)} x ${formatNumber(result.height, 4)}`}
            rows={[
              { label: "Aspect ratio", value: result.simple },
              { label: "Ratio as a decimal", value: formatNumber(result.width / result.height, 6) },
              { label: "Rounded to whole pixels", value: `${Math.round(result.width)} x ${Math.round(result.height)}` },
              { label: "Total pixels", value: Math.round(result.width * result.height).toLocaleString("en-US") },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "aspect-ratio-calculator",
  name: "Aspect Ratio Calculator",
  heading: "Aspect Ratio Calculator",
  category: "everyday",
  blurb: "Resize width or height while keeping the same aspect ratio.",
  seoTitle: "Aspect Ratio Calculator - Resize Width and Height",
  seoDescription:
    "Keep an image or video in proportion: enter an aspect ratio such as 16:9 and one dimension to get the other, plus whole-pixel rounding.",
  keywords: ["16:9", "resize image", "proportional resize", "4:3", "video dimensions"],
  intro:
    "Enter the ratio you need to hold — 16:9, 4:3, 1:1, or anything custom — plus the dimension you already know.",
  notes: [
    "Exact results are often fractional. 1000px wide at 16:9 is 562.5px tall, so the rounded row gives 563.",
    "Rounding one side changes the ratio very slightly, which matters for tiling and print but not for web images.",
  ],
  faq: [
    {
      question: "What aspect ratio should I use?",
      answer:
        "16:9 for video and most screens, 1:1 for profile images and many social posts, 4:5 for portrait social feeds, and 3:2 or 4:3 for photographs.",
    },
    {
      question: "Why does my image look stretched?",
      answer:
        "Because the width and height were changed by different factors. Set one dimension, calculate the other here, and the proportions hold.",
    },
  ],
  related: ["ratio-calculator", "fraction-calculator", "unit-conversion-calculator", "percentage-calculator"],
  Component: AspectRatioCalculator,
};
