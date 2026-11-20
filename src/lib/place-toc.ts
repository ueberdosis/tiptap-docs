/** Id of the style element that holds `--toc-offset`. */
export const tocOffsetStyleId = 'toc-offset';

/**
 * Moves the table of contents below `span`, an element that also takes its column: sets
 * `--toc-offset` on Fumadocs' page panel (`#nd-page-panel`), measured from the top of `#nd-page`.
 * The value goes into a style element of its own, since React owns the page panel's `style`
 * attribute and would find it changed on hydration.
 *
 * Uses only its arguments and the DOM, so it also runs as an inline script (`placeTocScript`).
 */
export function placeToc(span: Element, align: number, styleId: string) {
  const page = document.getElementById('nd-page');
  if (!page) return;
  const offset = span.getBoundingClientRect().bottom - page.getBoundingClientRect().top;
  let style = document.getElementById(styleId);
  if (!style) {
    style = document.createElement('style');
    style.id = styleId;
    document.head.append(style);
  }
  style.textContent = `#nd-page-panel{--toc-offset:${Math.round(offset + align)}px}`;
}

/**
 * Added to the offset, so "On this page" sits on the line of an H2 right below the span: the 48px
 * between a demo and that H2, minus the table of contents' 32px top padding, plus 6px to center
 * its 20px line on the H2's 32px line.
 */
export const tocAlign = 22;

/**
 * `placeToc` as an inline script for the element right before it. The table of contents is then
 * in place on the first paint.
 */
export const placeTocScript = `(${placeToc.toString()})(document.currentScript.previousElementSibling, ${tocAlign}, ${JSON.stringify(tocOffsetStyleId)})`;
