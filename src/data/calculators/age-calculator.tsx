import { useState } from "react";
import {
  CalcForm,
  DateControl,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  addYears,
  ageParts,
  daysBetween,
  formatDateLong,
  parseDate,
  todayISODate,
} from "@/lib/calc/date";

function AgeCalculator() {
  const [birth, setBirth] = useState("1990-06-15");
  const [on, setOn] = useState(todayISODate());
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: Date;
    daysToBirthday: number;
  } | null>(null);

  function calculate() {
    const birthDate = parseDate(birth);
    const onDate = parseDate(on);
    if (!birthDate || !onDate) {
      setResult(null);
      setError("Enter a valid date of birth and a valid date to calculate to.");
      return;
    }
    if (birthDate.getTime() > onDate.getTime()) {
      setResult(null);
      setError("The date of birth is after the date you are calculating to.");
      return;
    }

    const parts = ageParts(birthDate, onDate);
    let nextBirthday = addYears(birthDate, parts.years + 1);
    if (daysBetween(onDate, nextBirthday) < 0) nextBirthday = addYears(birthDate, parts.years + 2);

    setError(null);
    setResult({
      ...parts,
      nextBirthday,
      daysToBirthday: daysBetween(onDate, nextBirthday),
    });
  }

  function reset() {
    setBirth("1990-06-15");
    setOn(todayISODate());
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="ag-birth" label="Date of birth">
            <DateControl id="ag-birth" value={birth} onChange={setBirth} />
          </Field>
          <Field id="ag-on" label="Age at date" hint="Defaults to today. Change it to check a future or past date.">
            <DateControl id="ag-on" value={on} onChange={setOn} hint />
          </Field>
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Age"
            value={`${result.years} years, ${result.months} months, ${result.days} days`}
            rows={[
              { label: "Total days", value: result.totalDays.toLocaleString("en-US") },
              { label: "Total months", value: `${result.years * 12 + result.months}` },
              { label: "Total weeks", value: Math.floor(result.totalDays / 7).toLocaleString("en-US") },
              { label: "Next birthday", value: `${formatDateLong(result.nextBirthday)} (${result.daysToBirthday} days)` },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "age-calculator",
  name: "Age Calculator",
  heading: "Age Calculator",
  category: "time-date",
  featured: true,
  blurb: "Exact age in years, months and days from a date of birth.",
  seoTitle: "Age Calculator - Exact Age in Years, Months and Days",
  seoDescription:
    "Work out an exact age from a date of birth: years, months and days, total days and weeks lived, and the countdown to the next birthday.",
  keywords: ["how old am I", "date of birth", "birthday countdown", "age in days", "age in months"],
  intro:
    "Enter a date of birth to get an exact calendar age rather than a rounded number of years.",
  notes: [
    "Someone born on February 29 has their age advance on March 1 in non-leap years.",
    "The next-birthday countdown skips to the following year once the current year's birthday has passed.",
  ],
  faq: [
    {
      question: "Why do the months and days not divide evenly?",
      answer:
        "Months vary between 28 and 31 days, so a calendar age can only be expressed as whole years, whole months and leftover days. The total-days figure is the exact measure.",
    },
    {
      question: "Can I calculate age at a past date?",
      answer:
        "Yes. Set the second field to the date you care about, such as a school enrollment cut-off or the date of an event.",
    },
  ],
  related: ["days-between-dates-calculator", "date-calculator", "time-duration-calculator", "average-calculator"],
  Component: AgeCalculator,
};
