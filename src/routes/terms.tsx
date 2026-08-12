import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Terms of Use | ${SITE_NAME}`;
const description = "The terms that apply to using the calculators on Everyfigurecalc.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/terms") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/terms") }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Terms of Use</h1>
      <div className="mt-4 space-y-4 text-sm text-muted-foreground">
        <p>
          {SITE_NAME} is free to use. The calculators are provided as-is, for general information only. They are
          not payroll, tax, legal or financial advice.
        </p>
        <p>
          We aim to keep the math correct, but we cannot guarantee that every result fits your situation or your
          employer&apos;s rules. Check anything important against your own records or a qualified professional.
        </p>
        <p>
          You may use the calculators for personal and work purposes. Do not copy the site&apos;s content in bulk
          or republish it as your own.
        </p>
        <p>These terms may change. Continued use means you accept the current version.</p>
      </div>
    </div>
  );
}
