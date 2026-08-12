import { createFileRoute } from "@tanstack/react-router";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Contact | ${SITE_NAME}`;
const description = "How to report a wrong result or suggest a new calculator.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/contact") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/contact") }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Contact</h1>
      <div className="mt-4 space-y-4 text-sm text-muted-foreground">
        <p>Email us at noxfbusiness@gmail.com.</p>
        <p>
          Useful things to include: the calculator you used, the numbers you entered and the result you expected.
          That makes it much faster to check.
        </p>
        <p>We read every message, but we cannot give payroll, tax, legal or financial advice.</p>
      </div>
    </div>
  );
}
