import { sidebarConfig as globalSidebar } from '@/content/sidebar'
import { sidebarConfig as uiComponentsSidebar } from '@/content/ui-components/sidebar'
import type { SidebarConfig } from '@/types'

/**
 * The sidebar for a page. All documentation shares the global sidebar
 * (src/content/sidebar.ts); UI Components keeps its own.
 */
export async function importSidebarConfigFromMarkdownPath(markdownPath: string[]): Promise<{
  sidebarConfig: SidebarConfig | undefined
}> {
  const sidebarConfig = markdownPath[0] === 'ui-components' ? uiComponentsSidebar : globalSidebar
  return { sidebarConfig }
}
