import type { ReactNode } from "react";

export const SITE_NAME = "EVERYFIGURECALC";
export const SITE_TAGLINE = "Free everyday calculators";
export const SITE_DESCRIPTION =
  "Free calculators for time, work hours, pay, money and everyday math. They run in your browser, with no sign-up.";

/** Production domain for everyfigurecalc.com. */
export const PRODUCTION_SITE_URL = "https://everyfigurecalc.com";

/**
 * Active site origin for canonical, og:url, sitemap and robots.
 * Empty on preview/staging so URLs stay relative (resolved against the live host).
 * Set VITE_SITE_URL=https://everyfigurecalc.com when deploying to production.
 */
export const SITE_URL =
  typeof import.meta.env["VITE_SITE_URL"] === "string" && import.meta.env["VITE_SITE_URL"].length > 0
    ? import.meta.env["VITE_SITE_URL"].replace(/\/$/, "")
    : "";

export function absoluteUrl(path: string): string {
  return SITE_URL ? `${SITE_URL}${path}` : path;
}

export function sitemapUrl(): string {
  return `${SITE_URL || PRODUCTION_SITE_URL}/sitemap.xml`;
}

export interface Faq {
  question: string;
  answer: string;
}

export type CategorySlug = "time-date" | "work-pay" | "money" | "everyday";

export interface Category {
  slug: CategorySlug;
  name: string;
  path: string;
  tagline: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
}

export interface CalculatorDef {
  /** URL slug, also the unique id. Lower case, hyphenated, no query params. */
  slug: string;
  /** Display name used in navigation, cards and search. */
  name: string;
  /** Page H1. Usually the same as name. */
  heading: string;
  category: CategorySlug;
  /** Shown in the homepage preview for its category. */
  featured?: boolean;
  /** One-line blurb for cards and lists. */
  blurb: string;
  seoTitle: string;
  seoDescription: string;
  /** Extra search terms beyond the name and blurb. */
  keywords: string[];
  /** One short line shown above the tool. Optional. */
  intro?: string;
  /** Short "How to use" points. Optional — only when genuinely helpful. */
  howToUse?: string[];
  /** A concrete worked example. Optional. */
  example?: { title: string; body: string };
  /** Edge cases and rounding notes. Optional. */
  notes?: string[];
  /** Optional questions worth answering. */
  faq?: Faq[];
  /** Slugs of related calculators. */
  related: string[];
  /** The interactive tool. Client-side only math, no network calls. */
  Component: () => ReactNode;
}
