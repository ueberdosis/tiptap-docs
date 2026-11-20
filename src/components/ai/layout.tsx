'use client';
import Link from 'fumadocs-core/link';
import type { LayoutTab } from 'fumadocs-ui/layouts/shared';
import { type DocsLayoutProps, DocsLayout as Layout } from 'fumadocs-ui/layouts/spacious';
import { usePathname } from 'next/navigation';
import { type ReactNode, useMemo } from 'react';
import { HeaderActions } from '@/components/header-actions';
import { VersionMenu } from '@/components/version-menu';
import { pickTab } from '@/lib/active-tab';
import type { SidebarTab } from '@/lib/navigation';
import { getVersionLinks, type VersionName } from '@/lib/versions';
import { AIChat, AIChatPanel, useAIChat } from './search';

export type Props = Omit<DocsLayoutProps, 'tree' | 'tabs'> & {
  /** The sidebar tabs. The page shows the tab with the longest scope its URL starts with. */
  sidebarTabs: SidebarTab[];
  /** The version of the pages in this layout. */
  version: VersionName;
  /** Page paths that both versions have, for the version switcher. */
  sharedPaths: string[];
  /** Shows the AI chat. Without it the layout has no chat button or panel. */
  aiChatEnabled: boolean;
};

type VersionLayoutProps = Omit<Props, 'aiChatEnabled'>;

export function DocsLayout({ aiChatEnabled, ...props }: Props) {
  if (!aiChatEnabled) return <VersionLayout {...props} />;
  return (
    <AIChat version={props.version}>
      <ChatLayout {...props} />
    </AIChat>
  );
}

function ChatLayout(props: VersionLayoutProps) {
  const { open, setOpen } = useAIChat();
  return (
    <VersionLayout {...props} aiChat={{ open, onOpenChange: setOpen, panel: <AIChatPanel /> }} />
  );
}

function VersionLayout({ sidebarTabs, version, sharedPaths, ...props }: VersionLayoutProps) {
  const pathname = usePathname().replace(/\/$/, '') || '/';
  const active = useMemo(() => pickTab(sidebarTabs, pathname), [sidebarTabs, pathname]);
  // Fumadocs marks the tab active whose `urls` holds the current URL.
  const tabs = useMemo<LayoutTab[]>(
    () =>
      sidebarTabs.map((tab) => ({
        title: tab.title,
        url: tab.url,
        urls: new Set(tab === active ? [pathname] : []),
      })),
    [sidebarTabs, active, pathname],
  );
  const shared = useMemo(() => new Set(sharedPaths), [sharedPaths]);
  const versionLinks = useMemo(
    () => getVersionLinks(version, pathname, shared),
    [version, pathname, shared],
  );
  const { nav } = props;
  // The nav title: the app title with the version menu beside it.
  const navWithVersions = useMemo<DocsLayoutProps['nav']>(
    () => ({
      ...nav,
      title: ({ className, ...linkProps }) => (
        <div className={className}>
          {/* A flex box like Fumadocs' own title link, so logo, text and version menu share one center line. */}
          <Link {...linkProps} className="inline-flex items-center">
            {nav?.title as ReactNode}
          </Link>
          <VersionMenu links={versionLinks} />
        </div>
      ),
    }),
    [nav, versionLinks],
  );

  return (
    <Layout
      {...props}
      nav={navWithVersions}
      tree={active.tree}
      tabs={tabs}
      slots={{ ...props.slots, actions: HeaderActions }}
    />
  );
}
