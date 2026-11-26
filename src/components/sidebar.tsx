'use client';
import { Menu } from '@base-ui/react/menu';
/**
 * Copy of the Fumadocs Spacious sidebar slot (`fumadocs-ui/layouts/spacious/slots/sidebar`,
 * fumadocs-ui 16.17.8), for `slots.sidebar` of the Spacious `DocsLayout`. Compare it with that file
 * on every Fumadocs update.
 *
 * Only change: `Folder`. A folder without an index page but with a `target` (`TargetFolder`) shows
 * a link to `target` that also folds the folder open. The link is never marked active.
 */
import { ScrollArea } from '@base-ui/react/scroll-area';
import { useTranslations } from '@fuma-translate/react';
import { cva } from 'class-variance-authority';
import { usePathname } from 'fumadocs-core/framework';
import Link from 'fumadocs-core/link';
import type * as PageTree from 'fumadocs-core/page-tree';
import {
  SidebarFolderContent as BaseSidebarFolderContent,
  SidebarFolderLink as BaseSidebarFolderLink,
  SidebarFolderTrigger as BaseSidebarFolderTrigger,
  SidebarItem as BaseSidebarItem,
  SidebarProvider as BaseSidebarProvider,
  type SidebarProviderProps as BaseSidebarProviderProps,
  SidebarSeparator as BaseSidebarSeparator,
  SidebarCollapseTrigger,
  SidebarDrawerContent,
  SidebarDrawerOverlay,
  SidebarFolder,
  SidebarTrigger,
  useFolderDepth,
  useSidebar,
} from 'fumadocs-ui/components/sidebar/base';
import { createLinkItemRenderer } from 'fumadocs-ui/components/sidebar/link-item';
import { createPageTreeRenderer } from 'fumadocs-ui/components/sidebar/page-tree';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useTabsGroups, useTreePath } from 'fumadocs-ui/contexts/tree';
import { isLayoutTabActive, type LayoutTab, LinkItem } from 'fumadocs-ui/layouts/shared';
import { useSpaciousLayout } from 'fumadocs-ui/layouts/spacious';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  LanguagesIcon,
  MessageCircleIcon,
  SidebarIcon,
} from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { TargetFolder } from '@/lib/navigation';

/** the hover fill comes from the gliding block of `SidebarItems` */
const itemVariants = cva(
  'relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-start wrap-anywhere outline-none transition-colors focus-visible:ring-2 focus-visible:ring-fd-ring [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      active: {
        true: 'bg-fd-primary/10 text-fd-primary',
        false: 'text-fd-muted-foreground hover:text-fd-accent-foreground',
      },
    },
    defaultVariants: { active: false },
  },
);

const activeLine = <span className="absolute -start-1 inset-y-2 w-px bg-fd-primary" />;

export type SidebarProviderProps = Omit<BaseSidebarProviderProps, 'collapsible'>;

export function SidebarProvider(props: SidebarProviderProps) {
  return <BaseSidebarProvider {...props} />;
}

export function Sidebar({ className, ...props }: ComponentProps<'aside'>) {
  const { collapsed, mode } = useSidebar();
  const { slots } = useSpaciousLayout();
  if (mode !== 'full') return;
  return (
    <aside
      id="nd-sidebar"
      data-collapsed={collapsed}
      inert={collapsed}
      className={cn(
        '[grid-area:sidebar] flex min-h-0 overflow-clip text-sm md:layout:[--fd-sidebar-width:268px] max-md:hidden',
        collapsed && 'md:layout:[--fd-sidebar-col:--spacing(2)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'flex flex-col shrink-0 w-(--fd-sidebar-width) transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
          collapsed && '-translate-x-3 opacity-0 rtl:translate-x-3',
        )}
      >
        <div className="flex items-center gap-2 h-(--fd-header-height) my-2 ps-5.5 pe-3">
          <slots.navTitle className="inline-flex items-center gap-2 min-w-0 me-auto text-[0.9375rem] font-semibold" />
          <SidebarCollapseTrigger
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
              'size-8 text-fd-muted-foreground',
            )}
          >
            <SidebarIcon />
          </SidebarCollapseTrigger>
        </div>
        <div className="flex flex-col gap-2 px-3 empty:hidden">
          <TabsMenu />
          {slots.searchTrigger && (
            <slots.searchTrigger.full
              hideIfDisabled
              className="h-10 gap-3 rounded-xl ps-[calc(--spacing(2.5)-1px)] pe-2 [&_svg]:shrink-0"
            />
          )}
        </div>
        <SidebarViewport />
      </div>
    </aside>
  );
}

export function SidebarDrawer() {
  const { setOpen } = useSidebar();
  const {
    slots,
    menuItems,
    props: { aiChat },
  } = useSpaciousLayout();
  const t = useTranslations({ note: 'AI chat button' });
  return (
    <>
      <SidebarDrawerOverlay className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out" />
      <SidebarDrawerContent className="fixed z-40 inset-e-0 inset-y-0 flex flex-col w-[85%] max-w-95 text-[0.9375rem] bg-fd-background border-s shadow-lg data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out">
        <div className="flex items-center gap-1.5 h-(--fd-header-height) ps-3.5 pe-2.5 text-fd-muted-foreground">
          <div className="flex flex-1">
            {menuItems.map(
              (item, i) =>
                item.type === 'icon' && (
                  <LinkItem
                    // biome-ignore lint/suspicious/noArrayIndexKey: same as the Fumadocs original
                    key={i}
                    item={item}
                    aria-label={item.label}
                    className={buttonVariants({
                      variant: 'ghost',
                      size: 'icon-sm',
                      className: 'p-2',
                    })}
                  >
                    {item.icon}
                  </LinkItem>
                ),
            )}
          </div>
          {slots.languageSelect && (
            <slots.languageSelect.root>
              <LanguagesIcon className="size-4.5" />
              <slots.languageSelect.text />
            </slots.languageSelect.root>
          )}
          {slots.themeSwitch && <slots.themeSwitch className="p-0" />}
          <SidebarTrigger
            className={buttonVariants({ variant: 'ghost', size: 'icon-sm', className: 'p-2' })}
          >
            <SidebarIcon />
          </SidebarTrigger>
        </div>
        <div className="flex flex-col gap-2 px-3 empty:hidden">
          <TabsMenu />
          {aiChat && (
            <button
              type="button"
              className={cn(itemVariants(), 'hover:bg-fd-accent/60')}
              onClick={() => {
                setOpen(false);
                aiChat.onOpenChange(true);
              }}
            >
              <MessageCircleIcon />
              {t('Ask AI')}
            </button>
          )}
        </div>
        <SidebarViewport />
      </SidebarDrawerContent>
    </>
  );
}

function TabsMenu() {
  const {
    props: { tabs },
  } = useSpaciousLayout();
  const t = useTranslations();
  const pathname = usePathname();
  const path = useTreePath();
  const options =
    useTabsGroups(tabs).findLast((group) => typeof group.active?.root !== 'string')?.options ?? [];
  const selected = options.findLast((tab) => isLayoutTabActive(tab, path, pathname));
  if (options.length === 0) return;
  return (
    <Menu.Root>
      <Menu.Trigger className="flex w-full h-10 items-center gap-3 rounded-xl border bg-fd-secondary/50 ps-[calc(--spacing(2.5)-1px)] pe-2.5 text-start font-medium outline-none transition-colors hover:bg-fd-accent focus-visible:ring-2 focus-visible:ring-fd-ring data-popup-open:bg-fd-accent [&_svg]:size-4 [&_svg]:shrink-0">
        {selected && <TabIcon tab={selected} />}
        <span className={cn('flex-1 truncate', !selected && 'text-fd-muted-foreground')}>
          {selected ? selected.title : t('Layout Tab', { note: 'layout tab trigger' })}
        </span>
        <ChevronsUpDownIcon className="size-3.5! text-fd-muted-foreground" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          align="start"
          sideOffset={8}
          alignOffset={-4}
          positionMethod="fixed"
          className="z-50"
        >
          <Menu.Popup className="flex flex-col w-[calc(var(--anchor-width)+--spacing(2))] max-h-(--available-height) overflow-y-auto p-1 rounded-2xl border bg-fd-popover text-sm text-fd-popover-foreground shadow-lg outline-none origin-(--transform-origin) transition-[opacity,scale] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] data-starting-style:opacity-0 data-starting-style:scale-95 data-ending-style:opacity-0 data-ending-style:scale-97 data-ending-style:duration-100 motion-reduce:transition-none">
            {options.map((tab, i) => {
              if (tab.unlisted && tab !== selected) return null;
              return (
                <Menu.LinkItem
                  // biome-ignore lint/suspicious/noArrayIndexKey: same as the Fumadocs original
                  key={i}
                  closeOnClick
                  render={<Link href={tab.url} {...tab.props} />}
                  className={cn(
                    'flex w-full min-h-9 items-start gap-3 rounded-lg px-[calc(--spacing(2.5)-1px)] py-2 text-start outline-none transition-colors duration-100 data-highlighted:bg-fd-accent data-highlighted:text-fd-accent-foreground [&_svg]:size-4 [&_svg]:shrink-0',
                    tab.props?.className,
                  )}
                >
                  <TabIcon tab={tab} className="mt-0.5" />
                  <span className="flex flex-col flex-1 min-w-0">
                    <span className="truncate font-medium">{tab.title}</span>
                    {tab.description && (
                      <span className="truncate text-xs text-fd-muted-foreground">
                        {tab.description}
                      </span>
                    )}
                  </span>
                  {tab === selected && <CheckIcon className="mt-0.5 text-fd-primary" />}
                </Menu.LinkItem>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function TabIcon({ tab, className }: { tab: LayoutTab; className?: string }) {
  return (
    <span
      className={cn(
        'flex items-center justify-center shrink-0 size-4 font-medium',
        !tab.icon && 'rounded bg-fd-muted text-[10px] text-fd-muted-foreground',
        className,
      )}
    >
      {tab.icon ?? (typeof tab.title === 'string' ? tab.title.charAt(0) : null)}
    </span>
  );
}

function SidebarViewport() {
  return (
    <ScrollArea.Root className="min-h-0 flex-1 mt-2">
      <ScrollArea.Viewport className="size-full overscroll-contain px-3 pt-4 pb-8 mask-t-from-[calc(100%-16px)] mask-b-from-[calc(100%-32px)]">
        <SidebarItems />
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className={(s) =>
          cn('flex w-1.5 py-2 select-none transition-opacity', !s.hovering && 'opacity-0')
        }
      >
        <ScrollArea.Thumb className="flex-1 rounded-full bg-fd-border" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}

function SidebarItems() {
  const { menuItems } = useSpaciousLayout();
  const links = menuItems.filter((item) => item.type !== 'icon');
  return (
    <div ref={follow} className="relative flex flex-col">
      <div
        aria-hidden
        className="absolute top-0 left-0 py-0.5 rounded-lg bg-fd-accent/60 bg-clip-content opacity-0 pointer-events-none transition-opacity duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:transition-[translate,width,height,opacity]"
      />
      {links.map((item, i) => (
        <SidebarLinkItem
          // biome-ignore lint/suspicious/noArrayIndexKey: same as the Fumadocs original
          key={i}
          item={item}
          className={cn(i === links.length - 1 && 'mb-6')}
        />
      ))}
      <div className="flex flex-col">
        <SidebarPageTree Folder={Folder} />
      </div>
    </div>
  );
}

/** a soft block glides to the item under the mouse or keyboard focus */
function follow(area: HTMLDivElement | null) {
  const block = area?.firstElementChild;
  if (!area || !(block instanceof HTMLElement)) return;
  let current: Element | null = null;
  const show = (item: Element | null) => {
    if (item === current) return;
    block.style.transitionProperty = current ? '' : 'opacity';
    current = item;
    if (!item) {
      block.style.opacity = '0';
      return;
    }
    const rect = item.getBoundingClientRect();
    const origin = area.getBoundingClientRect();
    block.style.translate = `${rect.left - origin.left}px ${rect.top - origin.top}px`;
    block.style.width = `${rect.width}px`;
    block.style.height = `${rect.height}px`;
    block.style.opacity = item.matches('[data-active=true]') ? '0' : '1';
  };
  const itemOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest('a[href], button') : null;
  const controller = new AbortController();
  const { signal } = controller;
  area.addEventListener(
    'pointerover',
    (e) => {
      const item = itemOf(e.target);
      if (item && e.pointerType === 'mouse') show(item);
    },
    { signal },
  );
  area.addEventListener('pointerleave', () => show(null), { signal });
  area.addEventListener(
    'focusin',
    (e) => {
      if (e.target instanceof Element && e.target.matches(':focus-visible')) show(itemOf(e.target));
    },
    { signal },
  );
  area.addEventListener(
    'focusout',
    () => {
      if (!area.matches(':hover')) show(null);
    },
    { signal },
  );
  return () => controller.abort();
}

function SidebarSeparator({ className, ...props }: ComponentProps<typeof BaseSidebarSeparator>) {
  const depth = useFolderDepth();
  return (
    <BaseSidebarSeparator
      className={cn(
        'mb-1.5 px-2.5 text-xs font-medium text-fd-muted-foreground [&_svg]:size-3.5 [&_svg]:shrink-0',
        depth > 0 && 'mt-4 first:mt-1',
        className,
      )}
      {...props}
    />
  );
}

function SidebarItem({
  active,
  className,
  children,
  ...props
}: ComponentProps<typeof BaseSidebarItem>) {
  const depth = useFolderDepth();
  return (
    <BaseSidebarItem active={active} className={cn(itemVariants({ active }), className)} {...props}>
      {active && depth > 0 && activeLine}
      {children}
    </BaseSidebarItem>
  );
}

function SidebarFolderTrigger(props: ComponentProps<typeof BaseSidebarFolderTrigger>) {
  return (
    <BaseSidebarFolderTrigger
      {...props}
      className={cn(itemVariants(), '[&>[data-icon]]:size-3.5')}
    />
  );
}

function SidebarFolderLink({
  active,
  className,
  children,
  ...props
}: ComponentProps<typeof BaseSidebarFolderLink>) {
  const depth = useFolderDepth();
  return (
    <BaseSidebarFolderLink
      active={active}
      className={cn(itemVariants({ active }), '[&>[data-icon]]:size-3.5', className)}
      {...props}
    >
      {active && depth > 1 && activeLine}
      {children}
    </BaseSidebarFolderLink>
  );
}

function SidebarFolderContent({
  children,
  ...props
}: ComponentProps<typeof BaseSidebarFolderContent>) {
  return (
    <BaseSidebarFolderContent {...props} className="relative flex flex-col ms-3 ps-1">
      <span className="absolute start-0 inset-y-1 w-px bg-fd-border" />
      {children}
    </BaseSidebarFolderContent>
  );
}

/** Same comparison as `isActive` in `fumadocs-ui/utils/urls`. */
function normalize(url: string) {
  return url.length > 1 && url.endsWith('/') ? url.slice(0, -1) : url;
}

/** The default Fumadocs folder, plus a link for a folder with a `target`. */
function Folder({ item, children }: { item: PageTree.Folder; children: ReactNode }) {
  const pathname = usePathname();
  const path = useTreePath();
  const { target } = item as TargetFolder;
  let head: ReactNode;
  if (item.index) {
    head = (
      <SidebarFolderLink
        href={item.index.url}
        active={normalize(item.index.url) === normalize(pathname)}
        external={item.index.external}
      >
        {item.icon}
        {item.name}
      </SidebarFolderLink>
    );
  } else if (target) {
    head = (
      <SidebarFolderLink href={target} active={false}>
        {item.icon}
        {item.name}
      </SidebarFolderLink>
    );
  } else {
    head = (
      <SidebarFolderTrigger>
        {item.icon}
        {item.name}
      </SidebarFolderTrigger>
    );
  }
  return (
    <SidebarFolder
      collapsible={item.collapsible}
      active={path.includes(item)}
      defaultOpen={item.defaultOpen}
    >
      {head}
      <SidebarFolderContent>{children}</SidebarFolderContent>
    </SidebarFolder>
  );
}

const SidebarPageTree = createPageTreeRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
});

const SidebarLinkItem = createLinkItemRenderer({
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
});
