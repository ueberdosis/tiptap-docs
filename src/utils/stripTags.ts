/**
 * Plain text from HTML or JSX markup. Tags go, and so does any `<` or `>` a broken
 * or nested tag leaves behind, so the result can't open a tag of its own.
 */
export const stripTags = (value: string) => value.replace(/<[^<>]*>/g, '').replace(/[<>]/g, '')
