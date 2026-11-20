import type { SpecialEdits } from '../component-mapping.ts';

/**
 * Returns special edits for the catalog component `name`, for example `Extensions`. They rewrite
 * the `path` prop from `content/<x>` to `<x>` and throw when the element has no such `path`.
 */
export const catalogPathEdits =
  (name: string): SpecialEdits =>
  ({ label, source, start, end }) => {
    const match = /\spath="content\/([^"]+)"/.exec(source.slice(start, end));
    if (!match) throw new Error(`${label}: <${name}> has no path="content/…" prop`);
    const valueStart = start + match.index + match[0].indexOf('"') + 1;
    return [{ start: valueStart, end: valueStart + 'content/'.length, text: '' }];
  };
