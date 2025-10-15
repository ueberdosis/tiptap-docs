import { CopyMarkdownButton } from './CopyMarkdownButton'
import { PageHeaderBreadcrumbs } from './PageHeader.client'
import { SidebarConfig } from '@/types'
import { cn } from '@/utils'

export type PageHeaderWithCopyButtonProps = {
  /**
   * Configuration for the sidebar. Used by the PageHeaderBreadcrumbs component.
   */
  config: SidebarConfig

  /**
   * Path to the markdown file. Used by the CopyMarkdownButton component.
   */
  markdownPath?: string[]

  /**
   * Class name for the wrapper div element that organizes the layout of the breadcrumbs and the copy button.
   */
  className?: string
}

/**
 * Contains the breadcrumbs and the copy button, in a horizontal layout.
 */
export const PageHeaderWithCopyButton = ({
  config,
  markdownPath,
  className,
}: PageHeaderWithCopyButtonProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-start md:flex-row justify-between mb-4 gap-2 md:gap-0',
        className,
      )}
    >
      <PageHeaderBreadcrumbs config={config} />
      {markdownPath && <CopyMarkdownButton markdownPath={markdownPath} />}
    </div>
  )
}
