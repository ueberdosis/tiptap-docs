import { forwardRef } from 'react'
import { ArrowRightIcon } from 'lucide-react'
import Link from './Link'
import { Button } from './ui/Button'
import { cn } from '@/utils'

export type EnterpriseCalloutProps = {
  variant: 'migration' | 'ai-agent' | 'ai-toolkit' | 'semantic-search' | 'docx' | 'deprecated'
  inline?: boolean
  disableWaitlist?: boolean
  inverted?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const EnterpriseCallout = forwardRef<HTMLDivElement, EnterpriseCalloutProps>(
  (
    { variant, inline = false, disableWaitlist = false, inverted = false, className, ...rest },
    ref,
  ) => {
    const title =
      variant === 'migration'
        ? 'Migration support'
        : variant === 'ai-agent'
          ? 'Build AI Agents with expert support'
          : variant === 'ai-toolkit'
            ? 'Add AI Toolkit to your subscription'
            : variant === 'docx'
              ? 'Ship DOCX faster with expert support'
              : variant === 'deprecated'
                ? 'Migrate to AI Toolkit'
                : 'Join the semantic search beta'

    const description =
      variant === 'migration'
        ? 'Get hands-on help migrating your content as part of Business or Enterprise onboarding in a dedicated Slack channel.'
        : variant === 'ai-agent'
          ? "We're onboarding Enterprise teams building real-time editors. Get direct support for Agent setup, LLM integration, and performance tuning."
          : variant === 'ai-toolkit'
            ? 'Reach out to add AI Toolkit to your subscription. We can guide your integration with dedicated engineering support via Slack.'
            : variant === 'docx'
              ? 'Get dedicated Slack support, priority features, and hands-on help from our engineers to integrate DOCX into your enterprise application.'
              : variant === 'deprecated'
                ? "The AI Toolkit replaces this extension with better performance and more features. Your current setup keeps working. We'll help you migrate when ready."
                : 'Build intelligent search with dedicated engineering help and shape vector search capabilities by joining the Enterprise Beta program.'

    const waitlistText = 'On a different plan? Join the'

    const waitlistUrl =
      variant === 'ai-toolkit'
        ? 'https://tiptap.dev/contact-sales?form=ai-toolkit'
        : 'https://tiptap.dev/contact-sales?form=ai-toolkit'

    const talkToEngineerUrl =
      variant === 'ai-toolkit'
        ? 'https://tiptap.dev/contact-sales?form=ai-toolkit'
        : variant === 'deprecated'
          ? 'https://tiptap.dev/contact-sales?form=ai-toolkit'
          : 'https://tiptap.dev/contact-sales?form=ai-toolkit'

    const buttonText = variant === 'deprecated' ? 'Talk to an engineer' : 'Talk to an engineer'

    if (inline) {
      return (
        <div
          ref={ref}
          className={cn(
            'p-6 rounded-xl border max-w-[42rem]',
            inverted ? 'bg-grayAlpha-900 border-grayAlpha-700' : 'bg-white border-grayAlpha-200',
            className,
          )}
          {...rest}
        >
          <h3 className={cn('text-lg font-semibold mb-3', inverted ? 'text-white' : '')}>
            {title}
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <p
                className={cn(
                  'text-sm mb-3',
                  inverted ? 'text-grayAlpha-300' : 'text-grayAlpha-700',
                )}
              >
                {description.split('\n\n')[0]}
              </p>
              {description.split('\n\n')[1] && (
                <p
                  className={cn(
                    'text-sm mb-3',
                    inverted ? 'text-grayAlpha-300' : 'text-grayAlpha-700',
                  )}
                >
                  {description.split('\n\n')[1]}
                </p>
              )}

              {!disableWaitlist && variant !== 'ai-toolkit' && variant !== 'deprecated' && (
                <p
                  className={cn(
                    'text-xs mt-4',
                    inverted ? 'text-grayAlpha-400' : 'text-grayAlpha-600',
                  )}
                >
                  {waitlistText}{' '}
                  <Link
                    href={waitlistUrl}
                    target="_blank"
                    className={cn(
                      'font-medium underline whitespace-nowrap',
                      inverted
                        ? 'text-purpleAlpha-400 hover:text-purpleAlpha-300'
                        : 'text-purpleAlpha-600 hover:text-purpleAlpha-700',
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
                  href={talkToEngineerUrl}
                  target="_blank"
                  className={cn(
                    'inline-flex items-center justify-center gap-2',
                    inverted ? '!text-black hover:!text-black' : '',
                  )}
                >
                  {buttonText}
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </Button>

              <p
                className={cn(
                  'text-xs text-center',
                  inverted ? 'text-grayAlpha-400' : 'text-grayAlpha-500',
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
          inverted ? 'bg-grayAlpha-900 border-grayAlpha-700' : 'bg-white border-grayAlpha-200',
          className,
        )}
        {...rest}
      >
        <h3 className={cn('text-lg font-semibold mb-3', inverted ? 'text-white' : '')}>{title}</h3>
        <p
          className={cn(
            'text-sm mb-4 whitespace-pre-line',
            inverted ? 'text-grayAlpha-300' : 'text-grayAlpha-700',
          )}
        >
          {description}
        </p>

        <Button asChild className="w-full mb-3" variant={inverted ? 'secondary' : 'primary'}>
          <Link
            href={talkToEngineerUrl}
            target="_blank"
            className={cn(
              'inline-flex items-center justify-center gap-2',
              inverted ? '!text-black hover:!text-black' : '',
            )}
          >
            {buttonText}
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </Button>

        {!disableWaitlist && variant !== 'ai-toolkit' && variant !== 'deprecated' && (
          <div className="text-left mb-2">
            <p className={cn('text-xs', inverted ? 'text-grayAlpha-400' : 'text-grayAlpha-600')}>
              {waitlistText}{' '}
              <Link
                href={waitlistUrl}
                target="_blank"
                className={cn(
                  'font-medium underline whitespace-nowrap',
                  inverted
                    ? 'text-purpleAlpha-400 hover:text-purpleAlpha-300'
                    : 'text-purpleAlpha-600 hover:text-purpleAlpha-700',
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
            inverted ? 'border-grayAlpha-700' : 'border-grayAlpha-100',
          )}
        />

        <p className={cn('text-xs', inverted ? 'text-grayAlpha-400' : 'text-grayAlpha-500')}>
          Trusted by Axios, PostHog, Beehiiv, GitLab and more.
        </p>
      </div>
    )
  },
)

EnterpriseCallout.displayName = 'EnterpriseCallout'
