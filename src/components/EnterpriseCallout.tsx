import { forwardRef } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Link from './Link'
import { Button } from './ui/Button'
import { cn } from '@/utils'

export type EnterpriseCalloutProps = {
  variant:
    | 'migration'
    | 'ai-agent'
    | 'ai-toolkit'
    | 'server-ai-toolkit'
    | 'docx'
    | 'pdf'
    | 'odt'
    | 'epub'
    | 'doc'
    | 'markdown'
    | 'deprecated'
  inline?: boolean
  disableWaitlist?: boolean
  inverted?: boolean
} & React.HTMLAttributes<HTMLDivElement>

const VARIANT_CONFIG: Record<
  EnterpriseCalloutProps['variant'],
  { title: string; description: string; showWaitlist: boolean }
> = {
  migration: {
    title: 'Migration support',
    description:
      'Get hands-on help migrating your content as part of Business or Enterprise onboarding in a dedicated Slack channel.',
    showWaitlist: true,
  },
  'ai-agent': {
    title: 'Build AI Agents with expert support',
    description:
      "We're onboarding Enterprise teams building real-time editors. Get direct support for Agent setup, LLM integration, and performance tuning.",
    showWaitlist: true,
  },
  'ai-toolkit': {
    title: 'Add AI Toolkit to your subscription',
    description:
      'Integrate the AI Toolkit by purchasing the paid subscription add-on. We can guide your integration with dedicated engineering support via Slack.',
    showWaitlist: false,
  },
  'server-ai-toolkit': {
    title: 'Get access to the Server AI Toolkit',
    description:
      'Apply for early access to the Server AI Toolkit. Integrate it with success and get dedicated engineering support via Slack.',
    showWaitlist: false,
  },
  docx: {
    title: 'Ship DOCX faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate DOCX into your enterprise application.',
    showWaitlist: true,
  },
  pdf: {
    title: 'Ship PDF export faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate PDF export into your enterprise application.',
    showWaitlist: true,
  },
  odt: {
    title: 'Ship ODT export faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate ODT export into your enterprise application.',
    showWaitlist: true,
  },
  epub: {
    title: 'Ship EPUB export faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate EPUB export into your enterprise application.',
    showWaitlist: true,
  },
  doc: {
    title: 'Ship DOC export faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate DOC export into your enterprise application.',
    showWaitlist: true,
  },
  markdown: {
    title: 'Ship Markdown conversion faster with expert support',
    description:
      'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate Markdown conversion into your enterprise application.',
    showWaitlist: true,
  },
  deprecated: {
    title: 'Migrate to AI Toolkit',
    description:
      "The AI Toolkit replaces this extension with better performance and more features. Your current setup keeps working. We'll help you migrate when ready.",
    showWaitlist: false,
  },
}

const CONTACT_URL = 'https://tiptap.dev/contact-sales?form=ai-toolkit'

export const EnterpriseCallout = forwardRef<HTMLDivElement, EnterpriseCalloutProps>(
  (
    { variant, inline = false, disableWaitlist = false, inverted = false, className, ...rest },
    ref,
  ) => {
    const { title, description, showWaitlist } = VARIANT_CONFIG[variant]
    const displayWaitlist = showWaitlist && !disableWaitlist

    const waitlistText = 'On a different plan? Join the'
    const buttonText = 'Talk to an engineer'

    if (inline) {
      return (
        <div
          ref={ref}
          className={cn(
            'p-6 rounded-xl border max-w-[42rem]',
            inverted ? 'bg-inverse border-inverse-border' : 'bg-card border-border',
            className,
          )}
          {...rest}
        >
          <h3
            className={cn(
              'text-lg font-semibold mb-3',
              inverted ? 'text-inverse-foreground' : 'text-foreground',
            )}
          >
            {title}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p
                className={cn(
                  'text-sm mb-3',
                  inverted ? 'text-inverse-foreground/80' : 'text-foreground-muted',
                )}
              >
                {description.split('\n\n')[0]}
              </p>
              {description.split('\n\n')[1] && (
                <p
                  className={cn(
                    'text-sm mb-3',
                    inverted ? 'text-inverse-foreground/80' : 'text-foreground-muted',
                  )}
                >
                  {description.split('\n\n')[1]}
                </p>
              )}

              {displayWaitlist && (
                <p
                  className={cn(
                    'text-xs mt-4',
                    inverted ? 'text-inverse-foreground/65' : 'text-foreground-muted',
                  )}
                >
                  {waitlistText}{' '}
                  <Link
                    href={CONTACT_URL}
                    target="_blank"
                    className={cn(
                      'font-medium underline whitespace-nowrap',
                      inverted
                        ? 'text-accent hover:text-accent/80'
                        : 'text-info-foreground hover:text-info',
                    )}
                  >
                    waitlist
                  </Link>
                </p>
              )}
            </div>

            <div className="md:col-span-1 flex flex-col gap-2">
              <Button asChild className="w-full" variant={inverted ? 'secondary' : 'primary'}>
                <Link
                  href={CONTACT_URL}
                  target="_blank"
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    inverted ? '!text-foreground hover:!text-foreground' : '',
                  )}
                >
                  {buttonText}
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>

              <p
                className={cn(
                  'text-xs text-center',
                  inverted ? 'text-inverse-foreground/65' : 'text-foreground-subtle',
                )}
              >
                Trusted by Axios, PostHog, Beehiiv, GitLab and more.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'p-5 rounded-xl border',
          inverted ? 'bg-inverse border-inverse-border' : 'bg-card border-border',
          className,
        )}
        {...rest}
      >
        <h3
          className={cn(
            'text-lg font-semibold mb-3',
            inverted ? 'text-inverse-foreground' : 'text-foreground',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm mb-4 whitespace-pre-line',
            inverted ? 'text-inverse-foreground/80' : 'text-foreground-muted',
          )}
        >
          {description}
        </p>

        <Button asChild className="w-full mb-3" variant={inverted ? 'secondary' : 'primary'}>
          <Link
            href={CONTACT_URL}
            target="_blank"
            className={cn(
              'inline-flex items-center justify-center gap-2',
              inverted ? '!text-foreground hover:!text-foreground' : '',
            )}
          >
            {buttonText}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </Button>

        {displayWaitlist && (
          <div className="text-left mb-2">
            <p
              className={cn(
                'text-xs',
                inverted ? 'text-inverse-foreground/65' : 'text-foreground-muted',
              )}
            >
              {waitlistText}{' '}
              <Link
                href={CONTACT_URL}
                target="_blank"
                className={cn(
                  'font-medium underline whitespace-nowrap',
                  inverted ? 'text-accent hover:text-accent/80' : 'text-info-foreground hover:text-info',
                )}
              >
                waitlist
              </Link>
            </p>
          </div>
        )}

        <div
          className={cn(
            'border-t my-2',
            inverted ? 'border-inverse-border' : 'border-border',
          )}
        />

        <p
          className={cn(
            'text-xs',
            inverted ? 'text-inverse-foreground/65' : 'text-foreground-subtle',
          )}
        >
          Trusted by Axios, PostHog, Beehiiv, GitLab and more.
        </p>
      </div>
    )
  },
)

EnterpriseCallout.displayName = 'EnterpriseCallout'
