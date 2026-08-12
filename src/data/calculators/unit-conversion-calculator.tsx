import { useMemo, useState } from "react";
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
import { formatNumber, parseNumber } from "@/lib/calc/number";

type Family = "length" | "weight" | "volume" | "temperature";

/** Conversion factors to a base unit per family: meters, grams, liters. */
const UNITS: Record<Exclude<Family, "temperature">, { id: string; label: string; factor: number }[]> = {
  length: [
    { id: "mm", label: "Millimeters", factor: 0.001 },
    { id: "cm", label: "Centimeters", factor: 0.01 },
    { id: "m", label: "Meters", factor: 1 },
    { id: "km", label: "Kilometers", factor: 1000 },
    { id: "in", label: "Inches", factor: 0.0254 },
    { id: "ft", label: "Feet", factor: 0.3048 },
    { id: "yd", label: "Yards", factor: 0.9144 },
    { id: "mi", label: "Miles", factor: 1609.344 },
  ],
  weight: [
    { id: "g", label: "Grams", factor: 1 },
    { id: "kg", label: "Kilograms", factor: 1000 },
    { id: "oz", label: "Ounces", factor: 28.349523125 },
    { id: "lb", label: "Pounds", factor: 453.59237 },
    { id: "st", label: "Stones", factor: 6350.29318 },
    { id: "t", label: "Metric tons", factor: 1_000_000 },
  ],
  volume: [
    { id: "ml", label: "Milliliters", factor: 0.001 },
    { id: "l", label: "Liters", factor: 1 },
    { id: "tsp", label: "Teaspoons (US)", factor: 0.00492892159375 },
    { id: "tbsp", label: "Tablespoons (US)", factor: 0.01478676478125 },
    { id: "cup", label: "Cups (US)", factor: 0.2365882365 },
    { id: "pt", label: "Pints (US)", factor: 0.473176473 },
    { id: "qt", label: "Quarts (US)", factor: 0.946352946 },
    { id: "gal", label: "Gallons (US)", factor: 3.785411784 },
    { id: "floz", label: "Fluid ounces (US)", factor: 0.0295735295625 },
  ],
};

const TEMPERATURES = [
  { id: "c", label: "Celsius" },
  { id: "f", label: "Fahrenheit" },
  { id: "k", label: "Kelvin" },
];

function toCelsius(value: number, unit: string): number {
  if (unit === "f") return ((value - 32) * 5) / 9;
  if (unit === "k") return value - 273.15;
  return value;
}

function fromCelsius(celsius: number, unit: string): number {
  if (unit === "f") return (celsius * 9) / 5 + 32;
  if (unit === "k") return celsius + 273.15;
  return celsius;
}

function UnitConversionCalculator() {
  const [family, setFamily] = useState<Family>("length");
  const [from, setFrom] = useState("ft");
  const [to, setTo] = useState("m");
  const [amount, setAmount] = useState("6");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ value: number; fromLabel: string; toLabel: string } | null>(null);

  const options = useMemo(
    () =>
      family === "temperature"
        ? TEMPERATURES.map((unit) => ({ value: unit.id, label: unit.label }))
        : UNITS[family].map((unit) => ({ value: unit.id, label: unit.label })),
    [family],
  );

  function switchFamily(next: Family) {
    setFamily(next);
    setResult(null);
    setError(null);
    if (next === "temperature") {
      setFrom("c");
      setTo("f");
      return;
    }
    const list = UNITS[next];
    setFrom(list[0]!.id);
    setTo(list[1]!.id);
  }

  function labelFor(id: string): string {
    return options.find((option) => option.value === id)?.label ?? id;
  }

  function calculate() {
    const value = parseNumber(amount);
    if (value === null) {
      setResult(null);
      setError("Enter the amount you want to convert.");
      return;
    }

    if (family === "temperature") {
      if (from === "k" && value < 0) {
        setResult(null);
        setError("Kelvin cannot be negative — absolute zero is 0 K.");
        return;
      }
      const converted = fromCelsius(toCelsius(value, from), to);
      setError(null);
      setResult({ value: converted, fromLabel: labelFor(from), toLabel: labelFor(to) });
      return;
    }

    const list = UNITS[family];
    const fromUnit = list.find((unit) => unit.id === from);
    const toUnit = list.find((unit) => unit.id === to);
    if (!fromUnit || !toUnit) {
      setResult(null);
      setError("Choose a unit to convert from and a unit to convert to.");
      return;
    }
    if (value < 0) {
      setResult(null);
      setError("Length, weight and volume cannot be negative.");
      return;
    }

    setError(null);
    setResult({
      value: (value * fromUnit.factor) / toUnit.factor,
      fromLabel: fromUnit.label,
      toLabel: toUnit.label,
    });
  }

  function reset() {
    setFamily("length");
    setFrom("ft");
    setTo("m");
    setAmount("6");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="uc-family" label="Measurement">
            <SelectControl
              id="uc-family"
              value={family}
              onChange={switchFamily}
              options={[
                { value: "length", label: "Length" },
                { value: "weight", label: "Weight" },
                { value: "volume", label: "Volume" },
                { value: "temperature", label: "Temperature" },
              ]}
            />
          </Field>
          <Field id="uc-amount" label="Amount">
            <TextControl id="uc-amount" type="number" step="any" inputMode="decimal" value={amount} onChange={setAmount} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="uc-from" label="From">
            <SelectControl id="uc-from" value={from} onChange={setFrom} options={options} />
          </Field>
          <Field id="uc-to" label="To">
            <SelectControl id="uc-to" value={to} onChange={setTo} options={options} />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label={`${result.fromLabel} to ${result.toLabel}`}
            value={formatNumber(result.value, 6)}
            rows={[
              { label: "Rounded to 2 places", value: formatNumber(result.value, 2) },
              { label: "Unit", value: result.toLabel },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "unit-conversion-calculator",
  name: "Unit Conversion Calculator",
  heading: "Unit Conversion Calculator",
  category: "everyday",
  featured: true,
  blurb: "Convert length, weight, volume and temperature units.",
  seoTitle: "Unit Conversion Calculator - Length, Weight, Volume, Temp",
  seoDescription:
    "Convert between US and metric units: inches to centimeters, pounds to kilograms, cups to milliliters, Fahrenheit to Celsius and more.",
  keywords: ["inches to cm", "pounds to kg", "cups to ml", "fahrenheit to celsius", "metric conversion"],
  intro:
    "Pick what you are measuring, choose the units and enter the amount.",
  howToUse: [
    "Length, weight and volume each convert through a base unit — meters, grams and liters.",
    "The amount is multiplied by the source unit's factor and divided by the target unit's factor.",
    "Temperature is handled separately, because Celsius, Fahrenheit and Kelvin have different zero points as well as different scales.",
  ],
  notes: [
    "US volume units are used: a US cup is 236.588 ml, while a UK cup and a metric cup differ.",
    "A US fluid ounce measures volume and an ounce measures weight — they are not interchangeable.",
  ],
  faq: [
    {
      question: "How many centimeters are in an inch?",
      answer: "Exactly 2.54. The inch has been defined against the meter since 1959, so this is a definition, not a measurement.",
    },
    {
      question: "Why does my recipe convert oddly?",
      answer:
        "Volume-to-weight depends on the ingredient. A cup of flour and a cup of sugar weigh different amounts, so volume conversions cannot become weight conversions.",
    },
  ],
  related: ["aspect-ratio-calculator", "ratio-calculator", "average-calculator", "fraction-calculator"],
  Component: UnitConversionCalculator,
};
