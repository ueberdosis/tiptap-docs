import { forwardRef } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Link from './Link'
import { Button } from './ui/Button'
import { cn } from '@/utils'

export type EnterpriseCalloutProps = {
  variant: 'migration' | 'ai-agent' | 'ai-toolkit' | 'pages' | 'semantic-search' | 'docx'
  inline?: boolean
  disableWaitlist?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const EnterpriseCallout = forwardRef<HTMLDivElement, EnterpriseCalloutProps>(
  ({ variant, inline = false, disableWaitlist = false, className, ...rest }, ref) => {
    const title =
      variant === 'migration'
        ? 'Migration support'
        : variant === 'ai-agent'
          ? 'Build AI Agents with expert support'
          : variant === 'ai-toolkit'
            ? 'Integrate the AI Toolkit with expert support'
            : variant === 'pages'
              ? 'Integrate Pages with expert support'
              : variant === 'docx'
                ? 'Ship DOCX faster with expert support'
                : 'Join the semantic search beta'

    const description =
      variant === 'migration'
        ? 'Get hands-on help migrating your content as part of Enterprise onboarding.'
        : variant === 'ai-agent'
          ? "We're onboarding Enterprise teams building real-time editors. Get direct support for Agent setup, LLM integration, and performance tuning."
          : variant === 'ai-toolkit'
            ? "We're onboarding Enterprise teams building custom AI agents and extensions with the AI Toolkit. Get direct engineering support and shape the product roadmap."
            : variant === 'pages'
              ? "We're onboarding Enterprise teams ready to implement the page layout. Get direct engineering support and shape the product roadmap."
              : variant === 'docx'
                ? 'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate DOCX into your enterprise application.'
                : 'Build intelligent search with dedicated engineering help and shape vector search capabilities by joining the Enterprise Beta program.'

    const waitlistText = 'On a different plan? Join the'

    if (inline) {
      return (
        <div
          ref={ref}
          className={cn(
            'p-6 rounded-xl border border-grayAlpha-200 bg-white max-w-[42rem]',
            className,
          )}
          {...rest}
        >
          <h3 className="text-lg font-semibold mb-3">{title}</h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p className="text-sm text-grayAlpha-700 mb-3">{description.split('\n\n')[0]}</p>
              {description.split('\n\n')[1] && (
                <p className="text-sm text-grayAlpha-700 mb-3">{description.split('\n\n')[1]}</p>
              )}

              {!disableWaitlist && (
                <p className="text-xs text-grayAlpha-600 mt-4">
                  {waitlistText}{' '}
                  <Link
                    href="https://tiptap-suite.notion.site/1b601ffa3ebc80a281a8ea0b03b19bdd?pvs=105"
                    target="_blank"
                    className="font-medium text-purpleAlpha-600 hover:text-purpleAlpha-700 underline whitespace-nowrap"
                  >
                    waitlist
                  </Link>
                </p>
              )}
            </div>

            <div className="md:col-span-1 flex flex-col gap-2">
              <Button asChild className="w-full">
                <Link
                  href="https://tiptap.dev/contact-sales"
                  target="_blank"
                  className="inline-flex items-center justify-center gap-2"
                >
                  Talk to an engineer
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>

              <p className="text-xs text-grayAlpha-500 text-center">
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
        className={cn('p-5 rounded-xl border border-grayAlpha-200 bg-white', className)}
        {...rest}
      >
        <h3 className="text-lg font-semibold mb-3">{title}</h3>
        <p className="text-sm text-grayAlpha-700 mb-4 whitespace-pre-line">{description}</p>

        <Button asChild className="w-full mb-3">
          <Link
            href="https://tiptap.dev/contact-sales"
            target="_blank"
            className="inline-flex items-center justify-center gap-2"
          >
            Talk to an engineer
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </Button>

        {!disableWaitlist && (
          <div className="text-left mb-2">
            <p className="text-xs text-grayAlpha-600">
              {waitlistText}{' '}
              <Link
                href="https://tiptap-suite.notion.site/1b601ffa3ebc80a281a8ea0b03b19bdd?pvs=105"
                target="_blank"
                className="font-medium text-purpleAlpha-600 hover:text-purpleAlpha-700 underline whitespace-nowrap"
              >
                waitlist
              </Link>
            </p>
          </div>
        )}

        <div className="border-t border-grayAlpha-100 my-2" />

        <p className="text-xs text-grayAlpha-500">
          Trusted by Axios, PostHog, Beehiiv, GitLab and more.
        </p>
      </div>
    )
  },
)

EnterpriseCallout.displayName = 'EnterpriseCallout'
