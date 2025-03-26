import slugify from 'slugify'
import { ArrowRightIcon } from 'lucide-react'
import Link from '../Link'
import { Button } from './Button'

export type SectionProps = {
  title: string
  description?: string
  children: React.ReactNode
  moreLink?: { label: string; url: string }
}

export const Section = ({ children, title, description, moreLink }: SectionProps) => {
  const titleSlug = slugify(title, { lower: true })

  return (
    <section>
      <div className="flex items-center justify-between gap-8">
        <div className="flex-1">
          <h2 className="font-bold text-[1.875rem] leading-[120%]" id={titleSlug}>
            {title}
          </h2>
          {description ? (
            <p className="text-[1.125rem] mt-4 leading-[160%]">{description}</p>
          ) : null}
        </div>
        {moreLink ? (
          <div className="flex-none">
            <Button asChild variant="tertiary">
              <Link href={moreLink.url}>
                {moreLink.label}
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  )
}
