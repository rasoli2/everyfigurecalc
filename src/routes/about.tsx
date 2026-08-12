import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `About | ${SITE_NAME}`;
const description = "What Everyfigurecalc is, who runs it and how the calculators work.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/about") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/about") }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">About</h1>
      <div className="mt-4 space-y-4 text-sm text-muted-foreground">
        <p>
          {SITE_NAME} is a small collection of free calculators for the everyday math people look up most: time
          and date math, work hours and pay, prices and percentages, and basic number work.
        </p>
        <p>
          Every calculator runs in your browser. Nothing you type is sent to a server, and there is no sign-up.
        </p>
        <p>
          If a result looks wrong or a calculator you need is missing, let us know on the contact page.
        </p>
      </div>
    </div>
  );
}
