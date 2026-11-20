'use client';

import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactElement } from 'react';
import { cn } from '@/lib/cn';
import type { PageTag } from '@/lib/page-schema';
import {
  type TagLabel as Label,
  severityLabel,
  type TagLook,
  tagLabel,
} from '@/lib/page-tag-labels';

const label = 'rounded-md border px-1.5 py-0.5 text-xs font-medium';

const looks: Record<TagLook, string> = {
  neutral: 'bg-fd-secondary text-fd-secondary-foreground',
  primary: 'border-fd-primary/30 bg-fd-primary/10 text-fd-primary',
  warning: 'border-fd-warning/30 bg-fd-warning/10 text-fd-warning',
};

/** A tooltip above `trigger`, on hover and on keyboard focus. */
function Tip({ text, trigger }: { text?: string; trigger: ReactElement }) {
  if (!text) return trigger;
  return (
    <Tooltip.Root>
      <Tooltip.Trigger delay={300} render={trigger} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="top" sideOffset={6} className="z-50">
          <Tooltip.Popup className="max-w-64 origin-(--transform-origin) rounded-md border bg-fd-popover px-2 py-1 text-xs text-fd-popover-foreground shadow-md transition-[opacity,scale] duration-150 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
            {text}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

function TagLabel({ text, look, tooltip, href }: Label) {
  const className = cn(
    label,
    looks[look],
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
  );
  const trigger = href ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(className, 'hover:underline')}
    >
      {text}
    </a>
  ) : (
    <span tabIndex={tooltip ? 0 : undefined} className={className}>
      {text}
    </span>
  );
  return <Tip text={tooltip} trigger={trigger} />;
}

/**
 * A small neutral label after a sidebar entry's title, for example "Paid". Hidden in the page
 * panel, where breadcrumbs and previous/next links reuse the entry's name.
 */
export function SidebarLabel({ children }: { children: string }) {
  return (
    <span
      className={cn(label, looks.neutral, 'shrink-0 py-0 font-normal in-[#nd-page-panel]:hidden')}
    >
      {children}
    </span>
  );
}

export type PageTagsProps = {
  tags?: PageTag[];
  /** Incident severity. `high` and `critical` show a label first. */
  severity?: string;
  version: 'latest' | 'v2';
  /** Adds the template note to the default Start and Team plan tooltips on latest. */
  isTemplate?: boolean;
};

/** The row of page labels below the page description. Renders nothing without labels. */
export function PageTags({ tags = [], severity, version, isTemplate = false }: PageTagsProps) {
  const items: ReactElement[] = [];
  const severityProps = severityLabel(severity);
  if (severityProps) items.push(<TagLabel key="severity" {...severityProps} />);
  tags.forEach((tag, index) => {
    const key = `${tag.type}-${index}`;
    if (tag.type === 'image') {
      items.push(
        <a key={key} href={tag.url} target="_blank" rel="noopener noreferrer">
          {/* biome-ignore lint/performance/noImgElement: external badge image of unknown size */}
          <img src={tag.src} alt={tag.label} />
        </a>,
      );
      return;
    }
    const tagLabelProps = tagLabel(tag, version, isTemplate);
    if (tagLabelProps) items.push(<TagLabel key={key} {...tagLabelProps} />);
  });
  if (items.length === 0) return null;
  return <div className="not-prose flex flex-wrap items-center gap-1">{items}</div>;
}
