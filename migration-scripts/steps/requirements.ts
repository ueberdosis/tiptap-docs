import type { SpecialEdits } from '../component-mapping.ts';

/**
 * Adds a `## Requirements` heading and an empty line before the element. Throws if the element is
 * not at top level or does not start a line.
 */
export const requirementsEdits: SpecialEdits = ({ label, source, start, topLevel }) => {
  if (!topLevel || (start > 0 && source[start - 1] !== '\n')) {
    throw new Error(`${label}: <Requirements> is not at the start of a line at top level`);
  }
  return [{ start, end: start, text: '## Requirements\n\n' }];
};
