'use client';

import { Tooltip } from '@base-ui/react/tooltip';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const controlClass = cn(
  'inline-flex h-7 min-w-7 shrink-0 items-center justify-center gap-1.5 rounded-md px-1.5 text-xs font-medium transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-ring',
  '[&_svg]:size-3.5 [&_svg]:shrink-0',
);

/** A tooltip below `trigger`, on hover and on keyboard focus. */
function Tip({
  label,
  align = 'center',
  trigger,
}: {
  label: string;
  align?: 'center' | 'end';
  trigger: ReactElement;
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger delay={300} render={trigger} />
      <Tooltip.Portal>
        <Tooltip.Positioner side="bottom" align={align} sideOffset={6} className="z-50">
          <Tooltip.Popup className="origin-(--transform-origin) rounded-md border bg-fd-popover px-2 py-1 text-xs text-fd-popover-foreground shadow-md transition-[opacity,scale] duration-150 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
            {label}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export type ControlButtonProps = {
  /** The accessible name, and the tooltip unless `tooltip` is set. */
  label: string;
  tooltip?: string;
  tipAlign?: 'center' | 'end';
  isActive?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>;

/** A small button for the demo bar and the code header: an icon, or an icon and a short word. */
export function ControlButton({
  label,
  tooltip,
  tipAlign,
  isActive,
  className,
  children,
  ...rest
}: ControlButtonProps) {
  return (
    <Tip
      label={tooltip ?? label}
      align={tipAlign}
      trigger={
        <button
          type="button"
          aria-label={label}
          className={cn(
            controlClass,
            isActive
              ? 'bg-fd-background text-fd-foreground shadow-sm ring-1 ring-fd-border [&_svg]:text-fd-primary'
              : 'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            className,
          )}
          {...rest}
        >
          {children}
        </button>
      }
    />
  );
}

/** A link styled like a control button, such as "New tab" or the GitHub source. */
export function ControlLink({
  label,
  href,
  tooltip,
  tipAlign,
  className,
  children,
  ...rest
}: {
  label: string;
  href: string;
  tooltip?: string;
  tipAlign?: 'center' | 'end';
  children: ReactNode;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <Tip
      label={tooltip ?? label}
      align={tipAlign}
      trigger={
        <a
          href={href}
          aria-label={label}
          className={cn(
            controlClass,
            'text-fd-muted-foreground hover:bg-fd-accent hover:text-fd-accent-foreground',
            className,
          )}
          {...rest}
        >
          {children}
        </a>
      }
    />
  );
}

/** A row of buttons of which one is on, such as Preview / Code / Both. */
export function Segmented({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <fieldset
      aria-label={label}
      className={cn(
        'inline-flex shrink-0 items-center gap-0.5 rounded-lg bg-fd-muted p-0.5',
        className,
      )}
    >
      {children}
    </fieldset>
  );
}

/** A thin line between groups of controls. */
export function Divider() {
  return <span aria-hidden className="mx-1 h-4 w-px shrink-0 bg-fd-border" />;
}
