import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatUSDateInput, maskUSDateInput, parseUSDateInput } from "@/lib/calc/date";
import { formatTimeInput, toTimeValue, type TimeFormat } from "@/lib/calc/time";


/** Shared building blocks for every calculator. Keep calculator files thin by reusing these. */

export function CalcForm({
  children,
  onCalculate,
  onReset,
  error,
  submitLabel = "Calculate",
}: {
  children: ReactNode;
  onCalculate: () => void;
  onReset: () => void;
  error?: string | null | undefined;
  submitLabel?: string | undefined;
}) {
  return (
    <form
      className="rounded-md border-2 border-border-strong bg-card p-4 shadow-sm sm:p-5"
      onSubmit={(event) => {
        event.preventDefault();
        onCalculate();
      }}
      noValidate
    >
      <div className="space-y-4">{children}</div>

      {error ? <ErrorMessage>{error}</ErrorMessage> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md bg-primary px-6 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90 sm:flex-none"
        >
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-11 flex-1 items-center justify-center rounded-md border-2 border-border-strong bg-card px-5 text-sm font-bold text-foreground transition-colors hover:bg-surface sm:flex-none"
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export function FieldRow({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 | 3 | undefined }) {
  return (
    <div
      className={cn(
        "grid gap-4",
        cols === 2 && "sm:grid-cols-2",
        cols === 3 && "sm:grid-cols-3",
      )}
    >
      {children}
    </div>
  );
}

export function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block text-sm font-bold text-foreground">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

const controlClass =
  "block h-11 w-full rounded-md border-2 border-input bg-card px-3 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25";

export function TextControl({
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  inputMode,
  step,
  min,
  max,
  hint,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "time" | "date" | undefined;
  placeholder?: string | undefined;
  inputMode?: "decimal" | "numeric" | "text" | undefined;
  step?: string | undefined;
  min?: string | undefined;
  max?: string | undefined;
  hint?: boolean | undefined;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      value={value}
      step={step}
      min={min}
      max={max}
      inputMode={inputMode}
      placeholder={placeholder}
      aria-describedby={hint ? `${id}-hint` : undefined}
      onChange={(event) => onChange(event.target.value)}
      className={controlClass}
    />
  );
}

export function SelectControl<T extends string>({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <select
      id={id}
      name={id}
      value={value}
      onChange={(event) => onChange(event.target.value as T)}
      className={cn(controlClass, "appearance-none pr-8")}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function TextAreaControl({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string | undefined;
  rows?: number | undefined;
}) {
  return (
    <textarea
      id={id}
      name={id}
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="block w-full rounded-md border-2 border-input bg-card px-3 py-2 text-base font-medium text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25"
    />
  );
}

export function ErrorMessage({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="mt-4 rounded-md border-2 border-destructive/40 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">
      {children}
    </p>
  );
}

export interface ResultRow {
  label: string;
  value: string;
}

export function ResultPanel({
  label,
  value,
  rows,
  note,
}: {
  label: string;
  value: string;
  rows?: ResultRow[] | undefined;
  note?: string | undefined;
}) {
  return (
    <section
      aria-live="polite"
      className="mt-4 rounded-md border-2 border-result-border bg-result p-4 sm:p-5"
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-result-foreground/80">{label}</p>
      <p className="mt-1 font-mono text-3xl font-bold break-words text-result-foreground sm:text-4xl">
        {value}
      </p>
      {rows && rows.length > 0 ? (
        <dl className="mt-4 grid gap-x-6 gap-y-2 border-t-2 border-result-border/40 pt-3 sm:grid-cols-2">
          {rows.map((row) => (
            <div key={row.label} className="flex min-w-0 items-baseline justify-between gap-3">
              <dt className="text-sm text-result-foreground/80">{row.label}</dt>
              <dd className="font-mono text-sm font-bold text-result-foreground">{row.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {note ? <p className="mt-3 text-sm text-result-foreground/85">{note}</p> : null}
    </section>
  );
}

/** Wrapper so a live-updating result region stays announced but empty results render nothing. */
export function ResultSlot({ children }: { children: ReactNode }) {
  return <div aria-live="polite">{children}</div>;
}

/**
 * US date input. The visible value is always MM/DD/YYYY regardless of browser
 * locale; `value`/`onChange` stay on the internal ISO "YYYY-MM-DD" form so all
 * date math is unchanged.
 */
export function DateControl({
  id,
  value,
  onChange,
  hint,
  ariaLabel,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hint?: boolean | undefined;
  ariaLabel?: string | undefined;
  className?: string | undefined;
}) {
  const [text, setText] = useState(() => formatUSDateInput(value));
  const [seen, setSeen] = useState(value);

  if (value !== seen) {
    setSeen(value);
    if (parseUSDateInput(text) !== value) setText(formatUSDateInput(value));
  }

  return (
    <input
      id={id}
      name={id}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={text}
      placeholder="MM/DD/YYYY"
      aria-label={ariaLabel}
      aria-describedby={hint ? `${id}-hint` : undefined}
      onChange={(event) => {
        const masked = maskUSDateInput(event.target.value);
        setText(masked);
        const iso = parseUSDateInput(masked);
        setSeen(iso ?? "");
        onChange(iso ?? "");
      }}
      className={cn(controlClass, className)}
    />
  );
}

/**
 * Time input shown in the selected 12-hour or 24-hour format. `value`/`onChange`
 * stay on the internal 24-hour "HH:MM" form, so 8:45 PM and 20:45 are the same time.
 */
export function TimeControl({
  id,
  value,
  onChange,
  format = "12",
  hint,
  ariaLabel,
  className,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  format?: TimeFormat | undefined;
  hint?: boolean | undefined;
  ariaLabel?: string | undefined;
  className?: string | undefined;
}) {
  const [text, setText] = useState(() => formatTimeInput(value, format));
  const [seen, setSeen] = useState(value);
  const [seenFormat, setSeenFormat] = useState<TimeFormat>(format);

  if (format !== seenFormat) {
    setSeenFormat(format);
    setSeen(value);
    setText(formatTimeInput(value, format));
  } else if (value !== seen) {
    setSeen(value);
    if (toTimeValue(text) !== value) setText(formatTimeInput(value, format));
  }

  return (
    <input
      id={id}
      name={id}
      type="text"
      autoComplete="off"
      value={text}
      placeholder={format === "12" ? "8:45 AM" : "08:45"}
      aria-label={ariaLabel}
      aria-describedby={hint ? `${id}-hint` : undefined}
      onChange={(event) => {
        setText(event.target.value);
        const next = toTimeValue(event.target.value);
        setSeen(next);
        onChange(next);
      }}
      onBlur={() => {
        const next = toTimeValue(text);
        if (next) setText(formatTimeInput(next, format));
      }}
      className={cn(controlClass, className)}
    />
  );
}

/** 12-hour / 24-hour selector for time calculators. 12-hour is the default. */
export function TimeFormatField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: TimeFormat;
  onChange: (value: TimeFormat) => void;
}) {
  return (
    <Field id={id} label="Time format">
      <SelectControl
        id={id}
        value={value}
        onChange={onChange}
        options={[
          { value: "12", label: "12-hour (AM/PM)" },
          { value: "24", label: "24-hour" },
        ]}
      />
    </Field>
  );
}
