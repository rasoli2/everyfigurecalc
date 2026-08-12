import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { searchCalculators } from "@/data/calculators";
import { cn } from "@/lib/utils";

export function SiteSearch({
  id = "site-search",
  label = "Search calculators",
  size = "md",
  tone = "light",
}: {
  id?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const results = searchCalculators(query);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
          size === "lg" ? "h-5 w-5" : "h-4 w-4",
          tone === "dark" ? "text-header-muted" : "text-muted-foreground",
        )}
      />
      <input
        id={id}
        type="search"
        role="combobox"
        aria-expanded={open && results.length > 0}
        aria-controls={`${id}-results`}
        autoComplete="off"
        placeholder="Search calculators..."
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setOpen(false);
          if (event.key === "Enter" && results[0]) {
            event.preventDefault();
            setOpen(false);
            setQuery("");
            void navigate({ to: "/$slug", params: { slug: results[0].slug } });
          }
        }}
        className={cn(
          "w-full rounded-md border-2 font-medium outline-none",
          size === "lg" ? "h-13 pl-11 pr-4 text-base" : size === "sm" ? "h-10 pl-9 pr-3 text-sm" : "h-11 pl-10 pr-3 text-sm",
          tone === "dark"
            ? "border-white/25 bg-white/10 text-header-foreground placeholder:text-header-muted focus-visible:border-primary focus-visible:bg-white/15"
            : "border-border-strong bg-card text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25",
        )}
      />

      {open && query.trim().length >= 2 ? (
        <div
          id={`${id}-results`}
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-50 overflow-hidden rounded-md border-2 border-border-strong bg-card shadow-lg"
        >
          {results.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-muted-foreground">No calculator matches “{query.trim()}”.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-border overflow-y-auto">
              {results.map((calculator) => (
                <li key={calculator.slug}>
                  <Link
                    to="/$slug"
                    params={{ slug: calculator.slug }}
                    onClick={() => {
                      setOpen(false);
                      setQuery("");
                    }}
                    className="block px-3.5 py-2.5 hover:bg-surface"
                  >
                    <span className="block text-sm font-bold text-foreground">{calculator.name}</span>
                    <span className="block text-xs text-muted-foreground">{calculator.blurb}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
