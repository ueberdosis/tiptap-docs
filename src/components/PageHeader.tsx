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
    return (
      <Tag
        variant="invert"
        tooltip={tag.tooltip || 'Pro extensions require a Tiptap subscription.'}
      >
        Pro Extension
      </Tag>
    )
  }

  if (tag.type === 'beginStart') {
    return <Tag tooltip={tag.tooltip}>Available from Start plan</Tag>
  }

  if (tag.type === 'start') {
    return (
      <Tag
        tooltip={
          tag.tooltip ||
          'Integrate and use while subscribed to the Start plan. Usage of this template is subject to our Pro License and ToS.'
        }
      >
        Available in Start plan
      </Tag>
    )
  }

  if (tag.type === 'mit') {
    return (
      <Tag variant="invert" tooltip={tag.tooltip || 'Free to use under MIT license.'}>
        Available for free
      </Tag>
    )
  }

  if (tag.type === 'team') {
    return (
      <Tag
        tooltip={
          tag.tooltip ||
          'Integrate and use while subscribed to the Team plan. Usage of this template is subject to our Pro License and ToS.'
        }
      >
        Available in Team plan
      </Tag>
    )
  }

  if (tag.type === 'ai') {
    return <Tag tooltip={tag.tooltip}>Content AI</Tag>
  }

  if (tag.type === 'collaboration') {
    return <Tag tooltip={tag.tooltip}>Collaboration</Tag>
  }

  if (tag.type === 'documents') {
    return <Tag tooltip={tag.tooltip}>Documents</Tag>
  }

  if (tag.type === 'editor') {
    return <Tag tooltip={tag.tooltip}>Editor</Tag>
  }

  if (tag.type === 'new') {
    return (
      <Tag variant="info" tooltip={tag.tooltip}>
        New
      </Tag>
    )
  }

  if (tag.type === 'beta') {
    return (
      <Tag variant="info" tooltip={tag.tooltip}>
        Beta
      </Tag>
    )
  }

  if (tag.type === 'alpha') {
    return (
      <Tag variant="neutral" tooltip={tag.tooltip}>
        Alpha
      </Tag>
    )
  }

  if (tag.type === 'experiment') {
    return <Tag tooltip={tag.tooltip}>Experiment</Tag>
  }

  if (tag.type === 'restricted') {
    return (
      <Tag
        variant="hint"
        tooltip={
          tag.tooltip ||
          'This is a restricted release only available to our enterprise customers at the moment.'
        }
      >
        Restricted Release
      </Tag>
    )
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
