import Link from 'fumadocs-core/link';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type FeatureCardAction = { label: string; href: string };

export type FeatureCardProps = {
  /** Makes the whole card a link. Ignored when the card has `actions`. */
  href?: string;
  target?: string;
  rel?: string;
  /** Image URL. */
  image?: string;
  imageAlt?: string;
  /**
   * `top` (default): a cover above the text, cropped to one shape.
   * `side`: the whole image, uncropped, left of the text. Stacks above the text when the card is
   * narrow.
   */
  imagePosition?: 'top' | 'side';
  /** Small icon URL, shown next to the tags. */
  icon?: string;
  /** Small label above the title. */
  label?: string;
  title: ReactNode;
  tags?: string[];
  /** Links at the bottom. The first is the main one. */
  actions?: FeatureCardAction[];
  /** Text below the title. */
  children?: ReactNode;
};

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-md border bg-fd-secondary px-1.5 py-0.5 text-xs font-medium text-fd-secondary-foreground"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

/** Card with an optional cover image, icon, label, tags and action links, for a `Cards` grid. */
export function FeatureCard({
  href,
  target,
  rel,
  image,
  imageAlt,
  imagePosition = 'top',
  icon,
  label,
  title,
  tags = [],
  actions = [],
  children,
}: FeatureCardProps) {
  const linked = href !== undefined && actions.length === 0;
  const side = image !== undefined && imagePosition === 'side';
  const className = cn(
    'flex flex-col rounded-xl border bg-fd-card p-4 text-fd-card-foreground transition-colors @max-lg:col-span-full',
    // Directly in the page text, spaced like Fumadocs' Callout and code block. In a `Cards` grid,
    // the grid's gap spaces it
    '[.prose>&]:my-4',
    side && '@container',
    linked && 'hover:bg-fd-accent/80',
  );
  const text = (
    <>
      {icon && (
        <div className="not-prose mb-4 flex items-center justify-between gap-4">
          {/* biome-ignore lint/performance/noImgElement: `icon` is a URL without a known size */}
          <img src={icon} alt="" className="size-6" />
          {tags.length > 0 && <Tags tags={tags} />}
        </div>
      )}
      {label && (
        <p className="not-prose mb-1 text-xs font-medium text-fd-muted-foreground">{label}</p>
      )}
      <h3 className="not-prose mb-1 text-sm font-medium">{title}</h3>
      <div className="text-sm text-fd-muted-foreground prose-no-margin empty:hidden">
        {children}
      </div>
      {!icon && tags.length > 0 && (
        <div className="not-prose mt-auto pt-4">
          <Tags tags={tags} />
        </div>
      )}
      {actions.length > 0 && (
        <div className={cn('not-prose mt-auto flex flex-wrap gap-2', side ? 'pt-8' : 'pt-4')}>
          {actions.map((action, index) => (
            <Link
              key={action.href}
              href={action.href}
              className={cn(
                buttonVariants({ variant: index === 0 ? 'secondary' : 'ghost', size: 'sm' }),
                'gap-1.5',
              )}
            >
              {action.label}
              <ArrowRightIcon className="size-3.5" />
            </Link>
          ))}
        </div>
      )}
    </>
  );
  const content = side ? (
    <div className="grid gap-6 @md:grid-cols-2 @md:items-center">
      {/* biome-ignore lint/performance/noImgElement: `image` is a URL without a known size */}
      <img src={image} alt={imageAlt ?? ''} className="not-prose h-auto w-full rounded-lg border" />
      <div className="flex flex-col">{text}</div>
    </div>
  ) : (
    <>
      {image && (
        // biome-ignore lint/performance/noImgElement: `image` is a URL without a known size
        <img
          src={image}
          alt={imageAlt ?? ''}
          className="not-prose mb-4 aspect-[318/165] w-full rounded-lg border object-cover"
        />
      )}
      {text}
    </>
  );

  return linked ? (
    <Link href={href} target={target} rel={rel} data-card className={className}>
      {content}
    </Link>
  ) : (
    <div data-card className={className}>
      {content}
    </div>
  );
}
