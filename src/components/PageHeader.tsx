import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { PageHeaderBreadcrumbs } from './PageHeader.client'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { cn } from '@/utils'
import { ImagePageTag, PageTag } from '@/types'

export type PageHeaderWrapperProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PageHeaderWrapper = forwardRef<HTMLDivElement, PageHeaderWrapperProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'header'

    const wrapperClass = cn('mb-12 max-w-[42rem]', className)

    return (
      <Component className={wrapperClass} {...props} ref={ref}>
        {children}
      </Component>
    )
  },
)

PageHeaderWrapper.displayName = 'PageHeader.Wrapper'

export type PageHeaderTitleProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLHeadingElement>

const PageHeaderTitle = forwardRef<HTMLHeadingElement, PageHeaderTitleProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'h1'

    const titleClass = cn(
      'text-[3.125rem] font-bold text-black leading-none text-balance max-w-[18ch]',
      className,
    )

    return (
      <Component id="page-title" className={titleClass} {...props} ref={ref}>
        {children}
      </Component>
    )
  },
)

PageHeaderTitle.displayName = 'PageHeader.Title'

export type PageHeaderDescriptionProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLParagraphElement>

const PageHeaderDescription = forwardRef<HTMLParagraphElement, PageHeaderDescriptionProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'p'

    const descriptionClass = cn('text-[1.25rem] leading-[140%] text-black mt-8', className)

    return (
      <Component className={descriptionClass} {...props} ref={ref}>
        {children}
      </Component>
    )
  },
)

PageHeaderDescription.displayName = 'PageHeader.Description'

const isImageTag = (tag: PageTag): tag is ImagePageTag => {
  return tag.type === 'image'
}

export type PageHeaderTagsProps = {
  tags: PageTag[]
}

export const PageHeaderTags = ({ tags }: PageHeaderTagsProps) => {
  return (
    <div className="flex items-center gap-1 flex-wrap mt-6 last:mb-12">
      {tags.map((tag, index) => (
        <PageHeaderTag tag={tag} key={index} />
      ))}
    </div>
  )
}

export const PageHeaderTag = ({ tag }: { tag: PageTag }) => {
  if (isImageTag(tag)) {
    return (
      <Link href={tag.url} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tag.src} alt={tag.label} />
      </Link>
    )
  }

  if (tag.type === 'pro') {
    return <Tag variant="invert">Pro Extension</Tag>
  }

  if (tag.type === 'ai') {
    return <Tag>Content AI</Tag>
  }

  if (tag.type === 'collaboration') {
    return <Tag>Collaboration</Tag>
  }

  if (tag.type === 'documents') {
    return <Tag>Documents</Tag>
  }

  if (tag.type === 'editor') {
    return <Tag>Editor</Tag>
  }

  if (tag.type === 'new') {
    return <Tag variant="info">New</Tag>
  }

  if (tag.type === 'beta') {
    return <Tag variant="info">Beta</Tag>
  }

  if (tag.type === 'experiment') {
    return <Tag>Experiment</Tag>
  }
}

export const PageHeader = {
  Wrapper: PageHeaderWrapper,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
  Breadcrumbs: PageHeaderBreadcrumbs,
  Tags: PageHeaderTags,
  Tag: PageHeaderTag,
}
