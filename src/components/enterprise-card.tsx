'use client';

import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { useSpaciousLayout } from 'fumadocs-ui/layouts/spacious';
import { ArrowRightIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import enterpriseContent from '@/lib/enterprise-content.json';

type EnterpriseContent = {
  title: string;
  description: string;
  showWaitlist: boolean;
  contactUrl?: string;
  buttonText?: string;
};

const content: Record<string, EnterpriseContent> = enterpriseContent;

export type EnterpriseVariant = keyof typeof enterpriseContent;

const defaultContactUrl = 'https://tiptap.dev/contact-sales?form=ai-toolkit';
const defaultButtonText = 'Talk to an engineer';

type EnterpriseCardBoxProps = {
  variant: EnterpriseVariant;
  /** Hides the waitlist line. */
  disableWaitlist?: boolean;
  className?: string;
};

/** The card itself: text, contact button and waitlist line. Always visible. */
export function EnterpriseCardBox({ variant, disableWaitlist, className }: EnterpriseCardBoxProps) {
  const { title, description, showWaitlist, contactUrl, buttonText } = content[variant];
  const url = contactUrl ?? defaultContactUrl;

  return (
    <div
      className={cn(
        'not-prose flex flex-col gap-3 rounded-xl border bg-fd-card p-4 text-sm text-fd-card-foreground',
        className,
      )}
    >
      <p className="font-semibold">{title}</p>
      <p className="whitespace-pre-line text-fd-muted-foreground">{description}</p>
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className={cn(buttonVariants({ variant: 'primary' }), 'w-full gap-2')}
      >
        {buttonText ?? defaultButtonText}
        <ArrowRightIcon className="size-4" />
      </a>
      {showWaitlist && !disableWaitlist && (
        <p className="text-xs text-fd-muted-foreground">
          On a different plan? Join the{' '}
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="font-medium text-fd-foreground underline"
          >
            waitlist
          </a>
        </p>
      )}
      <hr />
      <p className="text-xs text-fd-muted-foreground">
        Trusted by Axios, PostHog, Beehiiv, GitLab and more.
      </p>
    </div>
  );
}

type EnterpriseCardProps = Omit<EnterpriseCardBoxProps, 'className'> & {
  /**
   * `sidebar`: shown in the page body only while the TOC column is hidden. The page template
   * shows it under the TOC otherwise. `inline`: always shown in the page body.
   */
  renderMode?: 'sidebar' | 'inline';
};

/** Enterprise card for MDX pages. */
export function EnterpriseCard({ renderMode = 'sidebar', ...props }: EnterpriseCardProps) {
  const { aiChat } = useSpaciousLayout().props;
  const tocHidden = Boolean(aiChat?.open && aiChat.panel);

  return (
    <EnterpriseCardBox
      {...props}
      className={cn('my-6', renderMode === 'sidebar' && !tocHidden && '@5xl:hidden')}
    />
  );
}
