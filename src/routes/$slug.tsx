import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { AdSlot } from "@/components/layout/ad-slot";
import { calculatorsInCategory, getCalculator, relatedCalculators } from "@/data/calculators";
import { categories, categoryBySlug } from "@/data/categories";
import { SITE_NAME, absoluteUrl, type Category, type CalculatorDef, type CategorySlug } from "@/data/site";

type Resolved =
  | { kind: "calculator"; slug: string; title: string; description: string }
  | { kind: "category"; slug: CategorySlug; title: string; description: string };

function resolve(slug: string): Resolved | null {
  const calculator = getCalculator(slug);
  if (calculator) {
    return {
      kind: "calculator",
      slug: calculator.slug,
      title: calculator.seoTitle,
      description: calculator.seoDescription,
    };
  }
  const category = categories.find((item) => item.slug === slug);
  if (category) {
    return {
      kind: "category",
      slug: category.slug,
      title: category.seoTitle,
      description: category.seoDescription,
    };
  }
  return null;
}

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const resolved = resolve(params.slug);
    if (!resolved) throw notFound();
    return resolved;
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: `Not found — ${SITE_NAME}` }, { name: "robots", content: "noindex" }],
      };
    }
    const url = absoluteUrl(`/${params.slug}`);
    const title = `${loaderData.title} | ${SITE_NAME}`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: loaderData.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: SlugPage,
});

function SlugPage() {
  const data = Route.useLoaderData() as Resolved;

  if (data.kind === "category") {
    const category = categoryBySlug[data.slug];
    if (!category) return null;
    return <CategoryView category={category} />;
  }
  const calculator = getCalculator(data.slug);
  if (!calculator) return null;
  return <CalculatorView calculator={calculator} />;
}

function Breadcrumbs({ items }: { items: { label: string; slug?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to="/" className="hover:text-primary hover:underline">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span aria-hidden="true">/</span>
            {item.slug ? (
              <Link to="/$slug" params={{ slug: item.slug }} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            ) : (
              <span className="text-foreground">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="border-b-2 border-foreground pb-1.5 text-sm font-extrabold uppercase tracking-[0.12em] text-foreground"
    >
      {children}
    </h2>
  );
}

function CategoryView({ category }: { category: Category }) {
  const tools = calculatorsInCategory(category.slug);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: category.name }]} />
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {category.name} Calculators
      </h1>
      <p className="mt-1 text-base text-muted-foreground">{category.tagline}</p>




      <ul className="mt-7 grid gap-3 sm:grid-cols-2">
        {tools.map((calculator) => (
          <li key={calculator.slug}>
            <Link
              to="/$slug"
              params={{ slug: calculator.slug }}
              className="group flex h-full flex-col rounded-md border-2 border-border-strong bg-card px-3.5 py-3 transition-colors hover:border-primary hover:bg-accent"
            >
              <span className="text-sm font-bold text-foreground group-hover:text-primary">{calculator.name}</span>
              <span className="mt-1 text-xs leading-snug text-muted-foreground">{calculator.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>

      <AdSlot id={`category-${category.slug}-bottom`} format="inline" />
    </div>
  );
}

function CalculatorView({ calculator }: { calculator: CalculatorDef }) {
  const category = categoryBySlug[calculator.category];
  const related = relatedCalculators(calculator).slice(0, 4);
  const Tool = calculator.Component;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <Breadcrumbs items={[{ label: category.name, slug: category.slug }, { label: calculator.name }]} />

      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {calculator.heading}
      </h1>
      {calculator.intro ? <p className="mt-1.5 text-base text-muted-foreground">{calculator.intro}</p> : null}

      <div className="mt-4">
        <Tool />
      </div>

      <AdSlot id={`calc-${calculator.slug}-mid`} format="inline" />

      {calculator.howToUse && calculator.howToUse.length > 0 ? (
        <section className="mt-8" aria-labelledby="how-to-use">
          <SectionHeading id="how-to-use">How it works</SectionHeading>
          <ul className="mt-3 space-y-1.5">
            {calculator.howToUse.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-foreground/80">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {calculator.example ? (
        <section className="mt-8" aria-labelledby="example">
          <SectionHeading id="example">Example</SectionHeading>
          <p className="mt-3 text-sm text-foreground/80">{calculator.example.body}</p>
        </section>
      ) : null}

      {calculator.notes && calculator.notes.length > 0 ? (
        <section className="mt-8" aria-labelledby="notes">
          <SectionHeading id="notes">Notes</SectionHeading>
          <ul className="mt-3 space-y-1.5">
            {calculator.notes.map((note) => (
              <li key={note} className="flex gap-2 text-sm text-foreground/80">
                <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {calculator.faq && calculator.faq.length > 0 ? (
        <section className="mt-8" aria-labelledby="faq">
          <SectionHeading id="faq">Common questions</SectionHeading>
          <dl className="mt-3 divide-y-2 divide-border">
            {calculator.faq.map((item) => (
              <div key={item.question} className="py-3 first:pt-0">
                <dt className="text-sm font-bold text-foreground">{item.question}</dt>
                <dd className="mt-1 text-sm text-foreground/80">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="mt-8" aria-labelledby="related">
        <SectionHeading id="related">Related calculators</SectionHeading>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                to="/$slug"
                params={{ slug: item.slug }}
                className="block rounded-md border-2 border-border-strong bg-card px-3 py-2 text-sm font-bold text-foreground transition-colors hover:border-primary hover:text-primary"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

