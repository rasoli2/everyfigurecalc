import type { Category, CategorySlug } from "./site";

export const categories: Category[] = [
  {
    slug: "time-date",
    name: "Time & Date",
    path: "/time-date",
    tagline: "Clock math, durations and calendar answers.",
    description:
      "Add or subtract times, measure the gap between two moments, count days between dates and work out exact ages. Every tool handles overnight spans and leap years correctly.",
    seoTitle: "Time & Date Calculators - Duration, Days Between, Age",
    seoDescription:
      "Free time and date calculators: time duration, hours between times, days between dates, date add or subtract, and exact age in years, months and days.",
  },
  {
    slug: "work-pay",
    name: "Work & Pay",
    path: "/work-pay",
    tagline: "Timesheets, shifts and overtime, worked out.",
    description:
      "Turn clock-in and clock-out times into paid hours, convert hours and minutes to decimal hours for payroll, split regular and overtime hours, and total a weekly time card.",
    seoTitle: "Work & Pay Calculators - Hours Worked, Overtime, Time Card",
    seoDescription:
      "Free work hour calculators: hours worked, weekly time card totals, overtime pay, decimal hour conversion and shift length with unpaid breaks.",
  },
  {
    slug: "money",
    name: "Money",
    path: "/money",
    tagline: "Prices, percentages, pay and payoff plans.",
    description:
      "Check what a sale price really saves you, run percentage math in any direction, see the effect of a raise, convert an hourly rate to a salary and plan a credit card payoff.",
    seoTitle: "Money Calculators - Discount, Percentage, Raise, Payoff",
    seoDescription:
      "Free money calculators: discount and sale price, percentage change, pay raise, hourly to salary conversion and credit card payoff time with interest.",
  },
  {
    slug: "everyday",
    name: "Everyday",
    path: "/everyday",
    tagline: "The small math you look up all the time.",
    description:
      "Add and simplify fractions, scale ratios, average a list of numbers, resize an image to a set aspect ratio and convert between common US and metric units.",
    seoTitle: "Everyday Calculators - Fractions, Ratios, Averages, Units",
    seoDescription:
      "Free everyday math calculators: fraction arithmetic, ratio scaling, average and median, aspect ratio resizing and unit conversion for length, weight and volume.",
  },
];

export const categoryBySlug: Record<CategorySlug, Category> = categories.reduce(
  (map, category) => {
    map[category.slug] = category;
    return map;
  },
  {} as Record<CategorySlug, Category>,
);
