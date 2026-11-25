import type { Metadata } from 'next';
import { DocsLayout } from '@/components/ai/layout';
import { V2NoticeBanner } from '@/components/v2-notice';
import { isAIChatEnabled } from '@/lib/ai-chat';
import { baseOptions } from '@/lib/layout.shared';
import { getSidebarTabs } from '@/lib/navigation';
import { appName, docsV2Route, isProductionSite, legacyRobots, previewRobots } from '@/lib/shared';
import { getSharedPagePaths } from '@/lib/source';
import { versionTitle } from '@/lib/versions';

export const metadata: Metadata = {
  title: { template: versionTitle('%s', 'v2'), default: versionTitle(appName, 'v2') },
  robots: isProductionSite ? legacyRobots : previewRobots,
};

export default function Layout({ children }: LayoutProps<'/docs/v2'>) {
  const sharedPaths = getSharedPagePaths();
  return (
    <>
      <V2NoticeBanner sharedPaths={sharedPaths} />
      <DocsLayout
        sidebarTabs={getSidebarTabs('v2')}
        version="v2"
        sharedPaths={sharedPaths}
        aiChatEnabled={isAIChatEnabled()}
        {...baseOptions(docsV2Route)}
      >
        {children}
      </DocsLayout>
    </>
  );
}
