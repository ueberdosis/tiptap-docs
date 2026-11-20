import { CodeDemo, type CodeDemoProps } from '@/components/code-demo';
import { TocSpan } from '@/components/toc-span';

/**
 * The live demo at the top of a page. Takes the table of contents' column too, while the table of
 * contents shows, and places the table of contents below itself. Same props as `CodeDemo`.
 *
 * Use once per page, at the top of the page body, right after the intro.
 */
export function HeaderDemo(props: CodeDemoProps) {
  return (
    <TocSpan>
      <CodeDemo {...props} />
    </TocSpan>
  );
}
