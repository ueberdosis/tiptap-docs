import { Slot } from '@radix-ui/react-slot'
import { forwardRef } from 'react'
import { PageHeaderBreadcrumbs } from './PageHeader.client'
import { Tag } from './ui/Tag'
import Link from '@/components/Link'
import { PLAN_LABELS } from '@/content/catalog'
import { cn } from '@/utils'
import { isNew } from '@/utils/isNew'
import { GeneralPageTag, ImagePageTag, PageTag } from '@/types'

export type PageHeaderWrapperProps = {
  asChild?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const PageHeaderWrapper = forwardRef<HTMLDivElement, PageHeaderWrapperProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const Component = asChild ? Slot : 'header'

    const wrapperClass = cn('mb-12 pb-12 border-b border-grayAlpha-200', className)

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
      'text-[2.8rem] font-bold text-black leading-none text-balance max-w-[42rem]',
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

export type PageHeaderIntroProps = React.HTMLAttributes<HTMLParagraphElement>

const PageHeaderIntro = forwardRef<HTMLParagraphElement, PageHeaderIntroProps>(
  ({ children, className, ...props }, ref) => {
    // Code and links look as they do in the content below
    const introClass = cn(
      'text-[1.125rem] leading-[150%] text-grayAlpha-700 mt-4 max-w-[42rem] text-pretty',
      '[&_code]:bg-gray-200 [&_code]:text-purple-600 [&_code]:rounded-[6px] [&_code]:px-[0.4em] [&_code]:text-[0.9em]',
      '[&_a]:border-b [&_a]:border-current hover:[&_a]:text-purple-500',
      className,
    )

    return (
      <p className={introClass} {...props} ref={ref}>
        {children}
      </p>
    )
  },
)

PageHeaderIntro.displayName = 'PageHeader.Intro'

const isImageTag = (tag: PageTag): tag is ImagePageTag => {
  return tag.type === 'image'
}

const PLAN_TYPES = ['restricted', 'addon', 'business', 'team', 'start', 'beginStart', 'mit', 'pro']
const STATUS_TYPES = ['deprecated', 'legacy', 'alpha', 'beta', 'experiment', 'new']

// Plan first, then status, then version, then npm badges, whatever the frontmatter order
const tagRank = (tag: PageTag) =>
  PLAN_TYPES.includes(tag.type)
    ? 0
    : STATUS_TYPES.includes(tag.type)
      ? 1 + STATUS_TYPES.indexOf(tag.type) / 10
      : tag.type === 'version'
        ? 2
        : 3

const PLAN_TAG: Record<string, GeneralPageTag['type']> = {
  'Pilot program': 'restricted',
  'Add-on': 'addon',
  Business: 'business',
  Team: 'team',
  Start: 'start',
  'Open source': 'mit',
}

const STATUS_TAG: Record<string, GeneralPageTag['type']> = {
  Deprecated: 'deprecated',
  Legacy: 'legacy',
  Alpha: 'alpha',
  Beta: 'beta',
}

/**
 * A page's header tags, with the plan and status it inherits from its feature
 * when it doesn't tag them itself, so a sub-page of a paid feature says so.
 */
export function headerTags(tags: PageTag[] = [], inherited?: { plan?: string; status?: string }) {
  const own = (types: string[]) => tags.some((tag) => types.includes(tag.type))
  const added: PageTag[] = []
  const plan = inherited?.plan && PLAN_TAG[inherited.plan]
  if (plan && !own(PLAN_TYPES)) added.push({ type: plan })
  const status = inherited?.status && STATUS_TAG[inherited.status]
  if (status && !own(STATUS_TYPES)) added.push({ type: status })
  return [...tags, ...added]
}

export type PageHeaderTagsProps = {
  tags: PageTag[]
  isTemplate?: boolean
}

export const PageHeaderTags = ({ tags, isTemplate = false }: PageHeaderTagsProps) => {
  // A legacy or deprecated page shouldn't also invite you in as Beta or New
  const endOfLife = tags.some((tag) => tag.type === 'deprecated' || tag.type === 'legacy')
  const sorted = tags
    .map((tag, index) => ({ tag, index }))
    .filter(({ tag }) => !endOfLife || !['alpha', 'beta', 'experiment', 'new'].includes(tag.type))
    .sort((a, b) => tagRank(a.tag) - tagRank(b.tag) || a.index - b.index)
  return (
    <div className="flex items-center gap-1 flex-wrap mt-6">
      {sorted.map(({ tag, index }) => (
        <PageHeaderTag tag={tag} isTemplate={isTemplate} key={index} />
      ))}
    </div>
  )
}

const PRICING_URL = 'https://tiptap.dev/pricing'
const TEMPLATE_LICENSE = ' Usage of this template is subject to our Pro License and ToS.'

/** A paid plan: in the paid colour, linking to where you get it. */
const PlanTag = ({
  href = PRICING_URL,
  tooltip,
  children,
}: {
  href?: string
  tooltip: string
  children: React.ReactNode
}) => (
  <Tag asChild variant="info" tooltip={tooltip}>
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </Link>
  </Tag>
)

export const PageHeaderTag = ({
  tag,
  isTemplate = false,
}: {
  tag: PageTag
  isTemplate?: boolean
}) => {
  if (isImageTag(tag)) {
    return (
      <Link href={tag.url} target="_blank" rel="noopener noreferrer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tag.src} alt={tag.label} />
      </Link>
    )
  }

  const license = isTemplate ? TEMPLATE_LICENSE : ''

  switch (tag.type) {
    case 'start':
    case 'beginStart':
      return (
        <PlanTag tooltip={tag.tooltip || `${PLAN_LABELS.Start.tooltip}${license}`}>
          {PLAN_LABELS.Start.label}
        </PlanTag>
      )
    case 'team':
      return (
        <PlanTag tooltip={tag.tooltip || `${PLAN_LABELS.Team.tooltip}${license}`}>
          {PLAN_LABELS.Team.label}
        </PlanTag>
      )
    case 'business':
      return (
        <PlanTag tooltip={tag.tooltip || 'Included in Business and Enterprise.'}>
          Business plan
        </PlanTag>
      )
    case 'addon':
      return (
        <PlanTag tooltip={tag.tooltip || PLAN_LABELS['Add-on'].tooltip}>
          {PLAN_LABELS['Add-on'].label}
        </PlanTag>
      )
    case 'restricted':
      return (
        <PlanTag
          href="https://tiptap.dev/contact-sales?form=pilot-program"
          tooltip={tag.tooltip || PLAN_LABELS['Pilot program'].tooltip}
        >
          {tag.label || PLAN_LABELS['Pilot program'].label}
        </PlanTag>
      )
    // Pro extensions became open source in Tiptap 3
    case 'mit':
    case 'pro':
      return (
        <Tag variant="gray" tooltip={tag.tooltip || PLAN_LABELS['Open source'].tooltip}>
          {PLAN_LABELS['Open source'].label}
        </Tag>
      )
    case 'alpha':
      return (
        <Tag variant="gray" tooltip={tag.tooltip || 'Works, but the API will change.'}>
          Alpha
        </Tag>
      )
    case 'beta':
      return (
        <Tag variant="gray" tooltip={tag.tooltip || 'Works, but the API may change.'}>
          Beta
        </Tag>
      )
    case 'experiment':
      return (
        <Tag variant="gray" tooltip={tag.tooltip || 'May change or go away.'}>
          Experimental
        </Tag>
      )
    case 'new':
      return isNew(tag.since) ? (
        <Tag variant="gray" tooltip={tag.tooltip}>
          New
        </Tag>
      ) : null
    case 'legacy':
      return (
        <Tag variant="hint" tooltip={tag.tooltip || 'Still supported, but not for new projects.'}>
          Legacy
        </Tag>
      )
    case 'deprecated':
      return (
        <Tag
          variant="hint"
          tooltip={tag.tooltip || 'Will be removed. Use what the page names instead.'}
        >
          Deprecated
        </Tag>
      )
    case 'version':
      return (
        <Tag variant="gray" tooltip={tag.tooltip}>
          {tag.label || 'Version'}
        </Tag>
      )
    default:
      return null
  }
}

export const PageHeader = {
  Wrapper: PageHeaderWrapper,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
  Intro: PageHeaderIntro,
  Breadcrumbs: PageHeaderBreadcrumbs,
  Tags: PageHeaderTags,
  Tag: PageHeaderTag,
}
