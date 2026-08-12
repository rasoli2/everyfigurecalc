import { Link, createFileRoute } from "@tanstack/react-router";
import { featuredInCategory } from "@/data/calculators";
import { categories } from "@/data/categories";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/data/site";

const title = `${SITE_NAME} — Free Time, Pay and Everyday Calculators`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: title },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">Free Calculators</h1>
      <p className="mt-1 text-base text-muted-foreground">Simple calculators for everyday use.</p>




      <div className="mt-8 space-y-8">
        {categories.map((category) => (
          <section key={category.slug} aria-labelledby={`cat-${category.slug}`}>
            <div className="flex items-baseline justify-between gap-4 border-b-2 border-foreground pb-1.5">
              <h2
                id={`cat-${category.slug}`}
                className="text-sm font-extrabold uppercase tracking-[0.12em] text-foreground"
              >
                {category.name}
              </h2>
              <Link
                to="/$slug"
                params={{ slug: category.slug }}
                className="shrink-0 text-sm font-bold text-primary hover:underline"
              >
                View all →
              </Link>
            </div>

            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {featuredInCategory(category.slug).map((calculator) => (
                <li key={calculator.slug}>
                  <Link
                    to="/$slug"
                    params={{ slug: calculator.slug }}
                    className="group flex h-full flex-col rounded-md border-2 border-border-strong bg-card px-3.5 py-3 transition-colors hover:border-primary hover:bg-accent"
                  >
                    <span className="text-sm font-bold text-foreground group-hover:text-primary">
                      {calculator.name}
                    </span>
                    <span className="mt-1 text-xs leading-snug text-muted-foreground">{calculator.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
