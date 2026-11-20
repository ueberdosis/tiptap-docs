import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export type IncidentCardProps = {
  href: string;
  title: string;
  severity: IncidentSeverity;
  /** For example `resolved`. Shown with a capital first letter. */
  status: string;
  /** Date as written in the source, for example `Jun 25, 2025, 9:39 PM GMT+2`. */
  date: string;
  /** Shown as a tag, for example `UI Component`. */
  product: string;
  /** Text below the title. */
  children?: ReactNode;
};

const label = 'rounded-md border px-1.5 py-0.5 text-xs font-medium';
const neutral = 'bg-fd-secondary text-fd-secondary-foreground';

const severityStyles: Record<IncidentSeverity, string> = {
  critical: 'border-fd-error/30 bg-fd-error/10 text-fd-error',
  high: 'border-fd-warning/30 bg-fd-warning/10 text-fd-warning',
  medium: neutral,
  low: neutral,
};

/** Linked full-width card for one security incident, for a `Cards` grid. */
export function IncidentCard({
  href,
  title,
  severity,
  status,
  date,
  product,
  children,
}: IncidentCardProps) {
  return (
    <Link
      href={href}
      data-card
      className="not-prose col-span-full flex flex-col rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors hover:bg-fd-accent/80"
    >
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium">{title}</h3>
        <span className={`${label} shrink-0 ${severityStyles[severity]}`}>
          {severity.toUpperCase()}
        </span>
      </div>
      <div className="text-sm text-fd-muted-foreground">{children}</div>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-3 text-xs text-fd-muted-foreground">
        <span>
          {status.charAt(0).toUpperCase() + status.slice(1)} {date}
        </span>
        <span aria-hidden>·</span>
        <span className={`${label} ${neutral}`}>{product}</span>
      </div>
    </Link>
  );
}
