import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  TimeControl,
  TimeFormatField,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  durationMinutes,
  formatDuration,
  formatDurationWords,
  parseTime,
  toDecimalHours,
  type TimeFormat,
} from "@/lib/calc/time";

function TimeDurationCalculator() {
  const [start, setStart] = useState("22:00");
  const [end, setEnd] = useState("06:00");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12");
  const [error, setError] = useState<string | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);

  function calculate() {
    const startMinutes = parseTime(start);
    const endMinutes = parseTime(end);
    if (startMinutes === null || endMinutes === null) {
      setMinutes(null);
      setError("Enter both times, for example 10:00 PM and 6:00 AM.");
      return;
    }
    setError(null);
    setMinutes(durationMinutes(startMinutes, endMinutes));
  }

  function reset() {
    setStart("22:00");
    setEnd("06:00");
    setError(null);
    setMinutes(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="td-start" label="Start time">
            <TimeControl id="td-start" value={start} onChange={setStart} format={timeFormat} />
          </Field>
          <Field id="td-end" label="End time" hint="Ends earlier than it starts? It is treated as overnight.">
            <TimeControl id="td-end" value={end} onChange={setEnd} format={timeFormat} hint />
          </Field>
        </FieldRow>
        <FieldRow>
          <TimeFormatField id="td-format" value={timeFormat} onChange={setTimeFormat} />
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {minutes !== null ? (
          <ResultPanel
            label="Duration"
            value={formatDuration(minutes)}
            rows={[
              { label: "In words", value: formatDurationWords(minutes) },
              { label: "Decimal hours", value: `${toDecimalHours(minutes)} h` },
              { label: "Total minutes", value: `${minutes} min` },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "time-duration-calculator",
  name: "Time Duration Calculator",
  heading: "Time Duration Calculator",
  category: "time-date",
  blurb: "Measure the exact hours and minutes between two times.",
  seoTitle: "Time Duration Calculator - Calculate Hours & Minutes",
  seoDescription:
    "Calculate the exact time between two times in hours and minutes with our free time duration calculator, including overnight spans that cross midnight.",
  keywords: [
    "hours between times",
    "time difference",
    "how many hours",
    "elapsed time",
    "minutes between times",
  ],
  intro:
    "Enter a start time and an end time to see exactly how much time passed.",
  notes: [
    "Identical start and end times give 0h 00m, not 24 hours.",
    "11:45 PM to 12:15 AM returns 30 minutes, because only the minutes actually elapsed are counted.",
  ],
  faq: [
    {
      question: "How do you calculate hours between two times that cross midnight?",
      answer:
        "The calculator handles it for you. From 10:00 PM to 6:00 AM it counts 8 hours instead of returning a negative result.",
    },
    {
      question: "Why do I need decimal hours?",
      answer:
        "Most payroll systems bill in decimal hours rather than hours and minutes. 8h 30m becomes 8.5, and 8h 20m becomes 8.33 after rounding to two places.",
    },
  ],
  related: ["time-calculator", "hours-worked-calculator", "decimal-hours-calculator", "shift-calculator"],
  Component: TimeDurationCalculator,
};
