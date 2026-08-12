import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { SiteSearch } from "./site-search";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b-4 border-primary bg-header text-header-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-3">
          <Link
            to="/"
            className="text-lg font-extrabold uppercase tracking-[0.08em] text-header-foreground sm:text-xl"
          >
            EVERYFIGURECALC
          </Link>


          <nav
            aria-label="Calculator categories"
            className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto md:order-2 md:mx-0 md:w-auto"
          >
            {categories.map((category) => (
              <Link
                key={category.slug}
                to="/$slug"
                params={{ slug: category.slug }}
                activeProps={{ className: "bg-primary text-primary-foreground" }}
                className="shrink-0 rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap text-header-muted transition-colors hover:bg-white/10 hover:text-header-foreground"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className="order-2 ml-auto w-full md:order-3 md:w-64 lg:w-72">
            <SiteSearch id="header-search" size="sm" tone="dark" />
          </div>

        </div>
      </div>
    </header>
  );
}
