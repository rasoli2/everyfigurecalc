import type { CalculatorDef, CategorySlug } from "../site";

import { calculator as timeCalculator } from "./time-calculator";
import { calculator as timeDurationCalculator } from "./time-duration-calculator";
import { calculator as dateCalculator } from "./date-calculator";
import { calculator as weeksCalculator } from "./weeks-calculator";
import { calculator as businessDaysCalculator } from "./business-days-calculator";
import { calculator as daysBetweenDatesCalculator } from "./days-between-dates-calculator";
import { calculator as ageCalculator } from "./age-calculator";
import { calculator as hoursWorkedCalculator } from "./hours-worked-calculator";
import { calculator as timeCardCalculator } from "./time-card-calculator";
import { calculator as overtimeCalculator } from "./overtime-calculator";
import { calculator as decimalHoursCalculator } from "./decimal-hours-calculator";
import { calculator as shiftCalculator } from "./shift-calculator";
import { calculator as discountCalculator } from "./discount-calculator";
import { calculator as percentageCalculator } from "./percentage-calculator";
import { calculator as raiseCalculator } from "./raise-calculator";
import { calculator as hourlyToSalaryCalculator } from "./hourly-to-salary-calculator";
import { calculator as creditCardPayoffCalculator } from "./credit-card-payoff-calculator";
import { calculator as fractionCalculator } from "./fraction-calculator";
import { calculator as ratioCalculator } from "./ratio-calculator";
import { calculator as averageCalculator } from "./average-calculator";
import { calculator as aspectRatioCalculator } from "./aspect-ratio-calculator";
import { calculator as unitConversionCalculator } from "./unit-conversion-calculator";

/**
 * The single registry every page reads from. To add a calculator: create a file
 * in this folder exporting `calculator: CalculatorDef`, then add it below.
 */
export const calculators: CalculatorDef[] = [
  timeCalculator,
  timeDurationCalculator,
  dateCalculator,
  weeksCalculator,
  businessDaysCalculator,
  daysBetweenDatesCalculator,
  ageCalculator,
  hoursWorkedCalculator,
  timeCardCalculator,
  overtimeCalculator,
  decimalHoursCalculator,
  shiftCalculator,
  discountCalculator,
  percentageCalculator,
  raiseCalculator,
  hourlyToSalaryCalculator,
  creditCardPayoffCalculator,
  fractionCalculator,
  ratioCalculator,
  averageCalculator,
  aspectRatioCalculator,
  unitConversionCalculator,
];

export const calculatorBySlug: Record<string, CalculatorDef> = calculators.reduce<
  Record<string, CalculatorDef>
>((map, calculator) => {
  map[calculator.slug] = calculator;
  return map;
}, {});

export function getCalculator(slug: string): CalculatorDef | undefined {
  return calculatorBySlug[slug];
}

export function calculatorsInCategory(category: CategorySlug): CalculatorDef[] {
  return calculators.filter((calculator) => calculator.category === category);
}

/**
 * The handful of calculators shown for a category on the homepage. Keeps the
 * homepage compact however many calculators the registry grows to.
 */
export function featuredInCategory(category: CategorySlug, limit = 4): CalculatorDef[] {
  const inCategory = calculatorsInCategory(category);
  const featured = inCategory.filter((calculator) => calculator.featured);
  return (featured.length > 0 ? featured : inCategory).slice(0, limit);
}

export function relatedCalculators(calculator: CalculatorDef): CalculatorDef[] {
  const picks = calculator.related
    .map((slug) => calculatorBySlug[slug])
    .filter((item): item is CalculatorDef => Boolean(item) && item!.slug !== calculator.slug);
  if (picks.length >= 3) return picks.slice(0, 4);

  const fillers = calculatorsInCategory(calculator.category).filter(
    (item) => item.slug !== calculator.slug && !picks.some((pick) => pick.slug === item.slug),
  );
  return [...picks, ...fillers].slice(0, 4);
}

export interface SearchHit {
  calculator: CalculatorDef;
  score: number;
}

/** Simple deterministic client-side search over name, blurb and keywords. */
export function searchCalculators(query: string, limit = 8): CalculatorDef[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  const terms = q.split(/\s+/);
  const hits: SearchHit[] = [];

  for (const calculator of calculators) {
    const name = calculator.name.toLowerCase();
    const haystack = [name, calculator.blurb, calculator.keywords.join(" ")].join(" ").toLowerCase();
    let score = 0;

    for (const term of terms) {
      if (name.startsWith(term)) score += 6;
      else if (name.includes(term)) score += 4;
      else if (calculator.keywords.some((keyword) => keyword.toLowerCase().includes(term))) score += 3;
      else if (haystack.includes(term)) score += 1;
      else {
        score = -1;
        break;
      }
    }

    if (score > 0) hits.push({ calculator, score });
  }

  return hits
    .sort((a, b) => b.score - a.score || a.calculator.name.localeCompare(b.calculator.name))
    .slice(0, limit)
    .map((hit) => hit.calculator);
}
