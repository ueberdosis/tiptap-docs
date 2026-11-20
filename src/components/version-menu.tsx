'use client';
import { Menu } from '@base-ui/react/menu';
import Link from 'fumadocs-core/link';
import { ArrowUpRightIcon, CheckIcon, ChevronDownIcon } from 'lucide-react';
import { SidebarLabel } from '@/components/page-tags';
import type { VersionLink } from '@/lib/versions';

/** A small dropdown with the docs versions. The trigger shows the active version. */
export function VersionMenu({ links }: { links: VersionLink[] }) {
  const current = links.find((link) => link.active);
  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label={`Version ${current?.label}`}
        className="inline-flex h-7 items-center gap-1 rounded-md px-1.5 text-sm font-medium text-fd-muted-foreground outline-none transition-colors hover:bg-fd-accent hover:text-fd-accent-foreground focus-visible:ring-2 focus-visible:ring-fd-ring data-popup-open:bg-fd-accent"
      >
        {current?.label}
        <ChevronDownIcon className="size-3.5" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start" sideOffset={6} positionMethod="fixed" className="z-50">
          <Menu.Popup className="flex w-44 flex-col rounded-xl border bg-fd-popover p-1 text-sm text-fd-popover-foreground shadow-lg outline-none origin-(--transform-origin) transition-[opacity,scale] duration-150 data-starting-style:scale-95 data-starting-style:opacity-0 data-ending-style:opacity-0 motion-reduce:transition-none">
            {links.map((link) => (
              <Menu.LinkItem
                key={link.label}
                closeOnClick
                render={<Link href={link.url} external={link.external} />}
                aria-current={link.active ? 'page' : undefined}
                className="flex min-h-8 items-center gap-2 rounded-lg px-2.5 py-1.5 outline-none data-highlighted:bg-fd-accent data-highlighted:text-fd-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0"
              >
                <span className="flex-1">{link.label}</span>
                {link.tag && <SidebarLabel>{link.tag}</SidebarLabel>}
                {link.active && <CheckIcon className="text-fd-primary" />}
                {link.external && <ArrowUpRightIcon className="text-fd-muted-foreground" />}
              </Menu.LinkItem>
            ))}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
