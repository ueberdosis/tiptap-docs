import { ArrowRightIcon } from 'lucide-react'
import { HTMLProps } from 'react'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import Link from '@/components/Link'
import { cn } from '@/utils'

export type ProductCardProps = {
  icon: string
  title: string
  description: string
  tags: string[]
  documentationUrl: string
  secondaryUrl?: string
  asChild?: boolean
  doubleWidth?: boolean
} & HTMLProps<HTMLDivElement>

export const ProductCard = ({
  className,
  description,
  documentationUrl,
  icon,
  tags,
  title,
  secondaryUrl,
  doubleWidth = false,
  ...rest
}: ProductCardProps) => {
  const wrapperClassName = cn('no-markdown', doubleWidth ? 'sm:col-span-2' : undefined, className)

  return (
    <Card isClickable className={wrapperClassName} {...rest}>
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt={title} className="size-6" />
        <div className="flex items-center gap-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 text-xs leading-[120%] text-grayAlpha-800 border border-grayAlpha-200 rounded-lg select-none"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-black leading-[140%]">{title}</h3>
        <p className="leading-[140%] mt-2 text-grayAlpha-600">{description}</p>
      </div>
      <div className="flex items-center gap-2 mt-8">
        <Button asChild variant="secondary">
          <Link href={documentationUrl}>
            Documentation
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </Button>
        {secondaryUrl ? (
          <Button asChild variant="tertiary">
            <Link href={secondaryUrl}>
              Example
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
