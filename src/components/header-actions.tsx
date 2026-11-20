'use client';
import { buttonVariants } from 'fumadocs-ui/components/ui/button';
import { HeaderActions as FumadocsHeaderActions } from 'fumadocs-ui/layouts/spacious/slots/actions';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

/** Spacious' header actions, then a "Sign up" button. Stays on one line and does not shrink. */
export function HeaderActions({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div className={cn('flex shrink-0 items-center gap-1 whitespace-nowrap', className)} {...props}>
      <FumadocsHeaderActions />
      <a
        href="https://cloud.tiptap.dev/register"
        target="_blank"
        rel="noopener noreferrer"
        // Black in light and white in dark, as on tiptap.dev, not the accent color.
        className={cn(
          buttonVariants(),
          'ms-1 h-7.5 bg-fd-foreground px-3 text-fd-background hover:bg-fd-foreground/85',
        )}
      >
        Sign up
      </a>
    </div>
  );
}
