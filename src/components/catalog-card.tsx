import Link from 'fumadocs-core/link';
import type { ReactNode } from 'react';

export type CatalogCardProps = {
  href: string;
  /** Icon element, for example a lucide icon. */
  icon: ReactNode;
  title: string;
  /** Labels in a row at the bottom. */
  tags?: string[];
  /** Shows a "New" label at the top right. */
  isNew?: boolean;
  /** Text below the title. */
  children?: ReactNode;
};

const label = 'rounded-md border px-1.5 py-0.5 text-xs font-medium';

/** Linked card with an icon, title, text and optional tags, for a `Cards` grid. */
export function CatalogCard({
  href,
  icon,
  title,
  tags = [],
  isNew = false,
  children,
}: CatalogCardProps) {
  return (
    <Link
      href={href}
      data-card
      className="not-prose flex flex-col rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors hover:bg-fd-accent/80 @max-lg:col-span-full"
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="w-fit rounded-lg border bg-fd-muted p-1.5 text-fd-muted-foreground shadow-md [&_svg]:size-4">
          {icon}
        </div>
        {isNew && (
          <span className={`${label} border-fd-primary/30 bg-fd-primary/10 text-fd-primary`}>
            New
          </span>
        )}
      </div>
      <h3 className="mb-1 text-sm font-medium">{title}</h3>
      <div className="text-sm text-fd-muted-foreground">{children}</div>
      {tags.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1 pt-3">
          {tags.map((tag) => (
            <span key={tag} className={`${label} bg-fd-secondary text-fd-secondary-foreground`}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
