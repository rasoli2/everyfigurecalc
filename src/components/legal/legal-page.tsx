import type { ReactNode } from "react";

export const LEGAL_EFFECTIVE_DATE = "August 12, 2026";

interface LegalPageProps {
  title: string;
  children: ReactNode;
}

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Effective Date / Last Updated: {LEGAL_EFFECTIVE_DATE}
      </p>
      <div className="mt-6 space-y-6 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

interface LegalSectionProps {
  title: string;
  children: ReactNode;
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
