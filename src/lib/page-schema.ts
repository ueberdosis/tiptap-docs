import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

/** Tag types a page may list in its `tags` frontmatter. */
export const pageTagTypes = [
  'image',
  'pro',
  'beginStart',
  'start',
  'addon',
  'mit',
  'team',
  'business',
  'ai',
  'collaboration',
  'documents',
  'editor',
  'new',
  'beta',
  'alpha',
  'experiment',
  'restricted',
  'deprecated',
  'version',
  'starter',
  'security',
] as const;

/** Frontmatter of a docs page, for latest and v2. `title` is optional. */
export const docsPageSchema = pageSchema.extend({
  title: z.string().optional(),
  category: z.string().optional(),
  meta: z
    .looseObject({
      title: z.string().optional(),
      description: z.string().nullable().optional(),
      category: z.string().optional(),
    })
    .optional(),
  tags: z
    .array(
      z.looseObject({
        type: z.enum(pageTagTypes),
        label: z.string().optional(),
        tooltip: z.string().optional(),
        src: z.string().optional(),
        url: z.string().optional(),
      }),
    )
    .optional(),
  sidebars: z
    .looseObject({
      hidePrimary: z.union([z.boolean(), z.record(z.string(), z.unknown())]).optional(),
      hideSecondary: z.union([z.boolean(), z.record(z.string(), z.unknown())]).optional(),
    })
    .optional(),
  extension: z
    .looseObject({
      name: z.string(),
      description: z.string(),
      link: z.string().nullable().optional(),
      type: z.string(),
      icon: z.string().nullable().optional(),
    })
    .optional(),
  component: z
    .looseObject({ name: z.string(), description: z.string(), type: z.string() })
    .optional(),
  incident: z
    .looseObject({
      product: z.string(),
      date: z.string(),
      status: z.string(),
      severity: z.string(),
    })
    .optional(),
});

/** One entry of the `tags` frontmatter. */
export type PageTag = NonNullable<z.infer<typeof docsPageSchema>['tags']>[number];
