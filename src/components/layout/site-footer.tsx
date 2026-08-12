import { Link } from "@tanstack/react-router";
import { categories } from "@/data/categories";
import { SITE_NAME } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t-4 border-primary bg-header text-header-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-base font-extrabold uppercase tracking-[0.08em]">{SITE_NAME}</p>

        <div className="mt-4 grid gap-6 sm:grid-cols-2">
          <nav aria-label="Categories">
            <p className="text-xs font-bold uppercase tracking-widest text-header-muted">Categories</p>
            <ul className="mt-2 space-y-1.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to="/$slug"
                    params={{ slug: category.slug }}
                    className="text-sm font-medium text-header-foreground/90 hover:text-header-foreground hover:underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Site information">
            <p className="text-xs font-bold uppercase tracking-widest text-header-muted">Site</p>
            <ul className="mt-2 space-y-1.5">
              {[
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
                { to: "/privacy", label: "Privacy" },
                { to: "/terms", label: "Terms" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm font-medium text-header-foreground/90 hover:text-header-foreground hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-6 border-t border-white/15 pt-4 text-xs text-header-muted">
          © {new Date().getFullYear()} <span className="uppercase">{SITE_NAME}</span>. Results are for general information only.
        </p>
      </div>
    </footer>
  );
}
