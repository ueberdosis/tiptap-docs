import { CopyMarkdownButton } from './CopyMarkdownButton'
import { PageHeaderBreadcrumbs } from './PageHeader.client'
import { SidebarConfig } from '@/types'
import { cn } from '@/utils'

export type PageHeaderWithCopyButtonProps = {
  config: SidebarConfig
  markdownPath?: string[]
  className?: string
}

export const PageHeaderWithCopyButton = ({
  config,
  markdownPath,
  className,
}: PageHeaderWithCopyButtonProps) => {
  return (
    <div
      className={cn(
        // Stack vertically on mobile (flex-col), horizontally on md+ (flex-row)
        'flex flex-col items-start md:flex-row justify-between mb-4 gap-2 md:gap-0',
        className,
      )}
    >
      <PageHeaderBreadcrumbs config={config} />
      {markdownPath && <CopyMarkdownButton markdownPath={markdownPath} />}
    </div>
  )
}
