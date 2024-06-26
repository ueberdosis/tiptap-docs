import { sidebarConfig as collaborationSidebar } from '@/content/collaboration/sidebar'
import { sidebarConfig as commentsSidebar } from '@/content/comments/sidebar'
import { sidebarConfig as contentAiSidebar } from '@/content/content-ai/sidebar'
import { sidebarConfig as editorSidebar } from '@/content/editor/sidebar'
import { sidebarConfig as baseSidebar } from '@/content/sidebar'

export const sidebars = {
  default: baseSidebar,
  editor: editorSidebar,
  collaboration: collaborationSidebar,
  'content-ai': contentAiSidebar,
  comments: commentsSidebar,
}
