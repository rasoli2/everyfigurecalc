import { useState } from "react";
import {
  CalcForm,
  Field,
  FieldRow,
  ResultPanel,
  ResultSlot,
  TextControl,
  TimeControl,
  TimeFormatField,
} from "@/components/calc/kit";
import type { CalculatorDef } from "@/data/site";
import {
  MINUTES_PER_DAY,
  formatClock12,
  formatClock24,
  formatDuration,
  parseTime,
  toDecimalHours,
  type TimeFormat,
} from "@/lib/calc/time";

function ShiftCalculator() {
  const [start, setStart] = useState("14:00");
  const [timeFormat, setTimeFormat] = useState<TimeFormat>("12");
  const [hours, setHours] = useState("8");
  const [minutes, setMinutes] = useState("0");
  const [breakMinutes, setBreakMinutes] = useState("45");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    endMinutes: number;
    paid: number;
    onSite: number;
    crossesMidnight: boolean;
  } | null>(null);

  function calculate() {
    const startMinutes = parseTime(start);
    if (startMinutes === null) {
      setResult(null);
      setError("Enter a valid shift start time.");
      return;
    }
    const h = hours.trim() === "" ? 0 : Number(hours);
    const m = minutes.trim() === "" ? 0 : Number(minutes);
    const unpaid = breakMinutes.trim() === "" ? 0 : Number(breakMinutes);
    if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || m < 0) {
      setResult(null);
      setError("Shift length must be zero or a positive number of hours and minutes.");
      return;
    }
    if (!Number.isFinite(unpaid) || unpaid < 0) {
      setResult(null);
      setError("Break minutes must be zero or more.");
      return;
    }

    const paidTarget = Math.round(h * 60 + m);
    if (paidTarget === 0) {
      setResult(null);
      setError("Enter how long the shift is.");
      return;
    }

    const onSite = paidTarget + unpaid;
    const raw = startMinutes + onSite;

    setError(null);
    setResult({
      endMinutes: raw,
      paid: paidTarget,
      onSite,
      crossesMidnight: raw >= MINUTES_PER_DAY,
    });
  }

  function reset() {
    setStart("14:00");
    setHours("8");
    setMinutes("0");
    setBreakMinutes("45");
    setError(null);
    setResult(null);
  }

  return (
    <>
      <CalcForm onCalculate={calculate} onReset={reset} error={error}>
        <FieldRow>
          <Field id="sh-start" label="Shift starts at">
            <TimeControl id="sh-start" value={start} onChange={setStart} format={timeFormat} />
          </Field>
          <Field id="sh-break" label="Unpaid break (minutes)">
            <TextControl id="sh-break" type="number" min="0" step="1" inputMode="numeric" value={breakMinutes} onChange={setBreakMinutes} />
          </Field>
        </FieldRow>
        <FieldRow>
          <Field id="sh-hours" label="Paid hours in the shift">
            <TextControl id="sh-hours" type="number" min="0" step="1" inputMode="numeric" value={hours} onChange={setHours} />
          </Field>
          <Field id="sh-minutes" label="Extra minutes">
            <TextControl id="sh-minutes" type="number" min="0" step="1" inputMode="numeric" value={minutes} onChange={setMinutes} />
          </Field>
        </FieldRow>
        <FieldRow>
          <TimeFormatField id="sh-format" value={timeFormat} onChange={setTimeFormat} />
        </FieldRow>
      </CalcForm>

      <ResultSlot>
        {result ? (
          <ResultPanel
            label="Shift ends at"
            value={formatClock12(result.endMinutes)}
            rows={[
              { label: "24-hour clock", value: formatClock24(result.endMinutes) },
              { label: "Paid time", value: `${formatDuration(result.paid)} (${toDecimalHours(result.paid)} h)` },
              { label: "Total time on site", value: formatDuration(result.onSite) },
              { label: "Day", value: result.crossesMidnight ? "Next day" : "Same day" },
            ]}
          />
        ) : null}
      </ResultSlot>
    </>
  );
}

export const calculator: CalculatorDef = {
  slug: "shift-calculator",
  name: "Shift Calculator",
  heading: "Shift Calculator",
  category: "work-pay",
  featured: true,
  blurb: "Find when a shift ends once breaks are included.",
  seoTitle: "Shift Calculator - Shift End Time With Breaks",
  seoDescription:
    "Enter a shift start time, the paid hours and the unpaid break to find the exact end time, total time on site and paid hours in decimal form.",
  keywords: ["shift end time", "when does my shift end", "night shift", "break schedule", "roster planning"],
  intro:
    "Rosters usually state a start time and a shift length, not an end time.",
  notes: [
    "A paid break should be left out of the break field — it is already inside your paid hours.",
    "Split shifts are best entered as two separate shifts, since the gap between them is not a break.",
  ],
  faq: [
    {
      question: "Does an eight-hour shift mean eight hours on site?",
      answer:
        "Usually not. If the break is unpaid, an eight-hour paid shift with a 30-minute lunch keeps you on site for eight and a half hours.",
    },
    {
      question: "How do I work backwards from an end time?",
      answer:
        "Use the Hours Worked Calculator: it takes a clock-in and clock-out time and tells you the paid hours in between.",
    },
  ],
  related: ["hours-worked-calculator", "time-card-calculator", "time-calculator", "overtime-calculator"],
  Component: ShiftCalculator,
};
