import { DocsLayout } from '@/components/ai/layout';
import { isAIChatEnabled } from '@/lib/ai-chat';
import { baseOptions } from '@/lib/layout.shared';
import { getSidebarTabs } from '@/lib/navigation';
import { docsRoute } from '@/lib/shared';
import { getSharedPagePaths } from '@/lib/source';

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout
      sidebarTabs={getSidebarTabs('latest')}
      version="latest"
      sharedPaths={getSharedPagePaths()}
      aiChatEnabled={isAIChatEnabled()}
      {...baseOptions(docsRoute)}
    >
      {children}
    </DocsLayout>
  );
}
