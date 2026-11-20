/**
 * Approved mapping from old components to Fumadocs components. One entry per old component name,
 * for example `Callout` or `CardGrid.Item`. `components.ts` reads it to rewrite the copied pages.
 * A component with an entry counts as known in strict mode.
 */
import enterpriseContent from '../src/lib/enterprise-content.json' with { type: 'json' };
import type { MdNode } from './mdast.ts';
import { cardGrids } from './steps/cards.ts';
import { catalogPathEdits } from './steps/catalogs.ts';
import { checklists } from './steps/checklists.ts';
import { contentCards } from './steps/content-cards.ts';
import { fullScreenButtons } from './steps/full-screen-buttons.ts';
import { linkCards } from './steps/link-cards.ts';
import { requirementsEdits } from './steps/requirements.ts';
import { boxes, sections } from './steps/sections-and-boxes.ts';
import { useCases } from './steps/use-cases.ts';

/**
 * What happens to one old prop.
 * - `keep`: stays as it is.
 * - `remove`: is removed.
 * - `{ to, values }`: is renamed to `to`. With `values`, the prop must be a string from `values`,
 *   and its value is replaced with the mapped one.
 */
export type PropRule = 'keep' | 'remove' | { to: string; values?: Record<string, string> };

/** A replacement of `source.slice(start, end)` with `text`. */
export type Edit = { start: number; end: number; text: string };

/**
 * Special code for one component, from `steps/`. Gets the page and the position of one element.
 * Returns extra edits. Throws to stop the script.
 */
export type SpecialEdits = (element: {
  /** Page path for error messages. */
  label: string;
  source: string;
  start: number;
  end: number;
  /** True when the element is a direct child of the page root. */
  topLevel: boolean;
}) => Edit[];

/**
 * Special code for an element shape made of several tags, from `steps/`. Gets every JSX element
 * outside `{…}`. Returns null when the element does not have the shape, or edits that replace the
 * whole element. Throws to stop the script.
 */
export type ShapeStep = {
  /** Name in the printed counts. */
  name: string;
  /** True when the step rewrites only the element's own tags, so its children are visited too. */
  keepsChildren?: boolean;
  edits: (element: { label: string; source: string; node: MdNode }) => Edit[] | null;
};

/** Shape steps, tried in this order before the mapping of a single component. */
export const shapeSteps: ShapeStep[] = [
  linkCards,
  fullScreenButtons,
  cardGrids,
  sections,
  boxes,
  checklists,
  contentCards,
  useCases,
];

export type ComponentMapping = {
  type: 'same' | 'other name' | 'new' | 'remove';
  /** The new component name. */
  to: string;
  /** Rules for every allowed old prop. Any other prop stops the script. */
  props: Record<string, PropRule>;
  /** New props added with this value when no old prop sets them. */
  defaults?: Record<string, string>;
  /** Extra edits beyond the prop rules. */
  special?: SpecialEdits;
  /** Name of the shape step that rewrites it. The component is not allowed outside that shape. */
  shape?: string;
};

/** Every value maps to itself. */
const sameValues = (values: string[]) => Object.fromEntries(values.map((value) => [value, value]));

/** A part of an old card grid. Only the shape step `cardGrids` rewrites it. */
const cardPart = (type: ComponentMapping['type'], to: string): ComponentMapping => ({
  type,
  to,
  props: {},
  shape: cardGrids.name,
});

/** A part of a `CtaBox` or `ImageCard`. Only the shape step `boxes` rewrites it. */
const boxPart = (type: ComponentMapping['type'], to: string): ComponentMapping => ({
  type,
  to,
  props: {},
  shape: boxes.name,
});

/** Demo viewer props of `CodeDemo` and `DemoViewer`. */
const viewerProps = [
  'view',
  'code',
  'codeHeight',
  'frameworks',
  'height',
  'maxHeight',
  'resizable',
  'themes',
  'sizes',
];

const enterpriseVariant: PropRule = {
  to: 'variant',
  values: sameValues(Object.keys(enterpriseContent)),
};

export const componentMapping: Record<string, ComponentMapping> = {
  Callout: {
    type: 'same',
    to: 'Callout',
    props: {
      title: 'keep',
      variant: {
        to: 'type',
        values: { default: 'info', info: 'info', hint: 'idea', warning: 'warning' },
      },
      type: { to: 'type', values: { info: 'info', tip: 'info' } },
      hasCalloutBefore: 'remove',
      hasCalloutAfter: 'remove',
    },
    defaults: { type: 'info' },
  },
  Requirements: {
    type: 'other name',
    to: 'Accordions',
    props: {},
    special: requirementsEdits,
  },
  RequirementItem: {
    type: 'other name',
    to: 'Accordion',
    props: { label: { to: 'title' } },
  },
  CodeDemo: {
    type: 'new',
    to: 'CodeDemo',
    props: Object.fromEntries(
      [
        'path',
        'src',
        'isPro',
        'isScrollable',
        'isLarge',
        'isSmall',
        'caption',
        'captionActions',
        'external',
        'externalTitle',
        'externalDescription',
        'externalIcon',
        'viewer',
        ...viewerProps,
      ].map((prop) => [prop, 'keep' as const]),
    ),
  },
  DemoViewer: {
    type: 'new',
    to: 'DemoViewer',
    props: Object.fromEntries(
      [
        'path',
        'src',
        'isPro',
        'isSmall',
        'isLarge',
        'caption',
        'expand',
        'className',
        ...viewerProps,
      ].map((prop) => [prop, 'keep' as const]),
    ),
  },
  Link: {
    type: 'other name',
    to: 'a',
    props: { href: 'keep', className: 'keep', target: 'keep', rel: 'keep' },
  },
  EnterpriseCalloutAuto: {
    type: 'new',
    to: 'EnterpriseCard',
    props: {
      variant: enterpriseVariant,
      renderMode: { to: 'renderMode', values: sameValues(['inline', 'sidebar']) },
      disableWaitlist: 'keep',
    },
  },
  EnterpriseCallout: {
    type: 'new',
    to: 'EnterpriseCard',
    props: { variant: enterpriseVariant, inline: 'remove', className: 'remove' },
    defaults: { renderMode: 'inline' },
  },
  'CardGrid.Wrapper': cardPart('other name', 'Cards'),
  'CardGrid.Item': cardPart('other name', 'Card or FeatureCard'),
  'CardGrid.Subtitle': cardPart('new', 'FeatureCard label'),
  'CardGrid.ItemImage': cardPart('new', 'FeatureCard image'),
  'CardGrid.ItemImageIcon': cardPart('other name', 'Card icon'),
  'CardGrid.ItemTitle': cardPart('other name', 'Card title'),
  'CardGrid.ItemParagraph': cardPart('other name', 'Card text'),
  'CardGrid.ItemFooter': cardPart('new', 'FeatureCard tags'),
  Tag: cardPart('new', 'FeatureCard tags'),
  'FilterGrid.Wrapper': cardPart('new', 'CardFilter'),
  'FilterGrid.Item': cardPart('new', 'CardFilter.Item'),
  'Grid.Wrapper': cardPart('other name', 'Cards'),
  'Grid.Item': cardPart('other name', 'Card'),
  'Grid.ItemHeader': cardPart('other name', 'Card icon'),
  'Grid.ItemContent': cardPart('remove', 'Card'),
  'Grid.ItemTitle': cardPart('other name', 'Card title'),
  'Grid.ItemParagraph': cardPart('other name', 'Card text'),
  ProductCard: cardPart('new', 'FeatureCard'),
  CloudIcon: cardPart('other name', 'Card icon img'),
  DedicatedCloudIcon: cardPart('other name', 'Card icon img'),
  OnPremisesIcon: cardPart('other name', 'Card icon img'),
  XIcon: cardPart('other name', 'Card icon img'),
  DiscordIcon: cardPart('other name', 'Card icon img'),
  GithubIcon: cardPart('other name', 'Card icon img'),
  ContentCard: { type: 'other name', to: 'Card', props: {}, shape: contentCards.name },
  Section: { type: 'remove', to: '## heading', props: {}, shape: sections.name },
  'CtaBox.Wrapper': boxPart('other name', 'FeatureCard'),
  'CtaBox.Title': boxPart('other name', 'FeatureCard title'),
  'CtaBox.Description': boxPart('remove', 'FeatureCard text'),
  'CtaBox.List': boxPart('remove', 'FeatureCard text list'),
  'CtaBox.ListItem': boxPart('remove', 'FeatureCard text list item'),
  'CtaBox.Actions': boxPart('other name', 'FeatureCard actions'),
  'ImageCard.Card': boxPart('other name', 'FeatureCard'),
  'ImageCard.Image': boxPart('other name', 'FeatureCard image'),
  'ImageCard.Content': boxPart('remove', 'FeatureCard'),
  'ImageCard.Title': boxPart('other name', 'FeatureCard title'),
  'ImageCard.Paragraph': boxPart('remove', 'FeatureCard text'),
  Button: boxPart('other name', 'FeatureCard action'),
  Checklist: { type: 'remove', to: 'Markdown list', props: {}, shape: checklists.name },
  CheckboxItem: { type: 'remove', to: 'Markdown list item', props: {}, shape: checklists.name },
  Extensions: {
    type: 'same',
    to: 'Extensions',
    props: { path: 'keep', hideAll: 'remove', hideFree: 'remove' },
    special: catalogPathEdits('Extensions'),
  },
  UIComponents: {
    type: 'same',
    to: 'UIComponents',
    props: { path: 'keep' },
    special: catalogPathEdits('UIComponents'),
  },
  UseCasesGrid: { type: 'other name', to: 'Cards', props: {}, shape: useCases.name },
  Incidents: {
    type: 'same',
    to: 'Incidents',
    props: {},
    defaults: { path: 'resources/incidents' },
  },
  FeatureCatalog: { type: 'same', to: 'FeatureCatalog', props: {} },
  CatalogGroup: { type: 'same', to: 'CatalogGroup', props: { id: 'keep' } },
};

/** `component.icon` renames. These source names are not lucide-react icons. */
export const iconRenames: Record<string, string> = {
  LightBulbIcon: 'LightbulbIcon',
  AlignTopIcon: 'ArrowUpDownIcon',
  ListIndented: 'TableOfContentsIcon',
};
