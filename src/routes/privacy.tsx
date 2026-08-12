import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Privacy Policy | ${SITE_NAME}`;
const description = "What data Everyfigurecalc collects, and what it does not.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/privacy") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Privacy Policy</h1>
      <div className="mt-4 space-y-4 text-sm text-muted-foreground">
        <h2 className="text-base font-semibold text-foreground">Calculator inputs</h2>
        <p>
          The calculators run entirely in your browser. The times, dates, amounts and numbers you enter are not
          sent to us and are not stored.
        </p>
        <h2 className="text-base font-semibold text-foreground">Analytics and ads</h2>
        <p>
          We may use standard web analytics and third-party ad services. These can set cookies and collect basic
          technical information such as your browser, approximate location and the pages you visit, in line with
          their own privacy policies.
        </p>
        <h2 className="text-base font-semibold text-foreground">Your choices</h2>
        <p>You can block or delete cookies in your browser settings. Doing so does not affect the calculators.</p>
        <h2 className="text-base font-semibold text-foreground">Contact</h2>
        <p>Questions about privacy: hello@everyfigurecalc.com.</p>
      </div>
    </div>
  );
}
