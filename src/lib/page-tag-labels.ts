import type { PageTag } from '@/lib/page-schema';

export type TagLook = 'neutral' | 'primary' | 'warning';

/** Text, look and optional tooltip and link of one page label. */
export type TagLabel = { text: string; look: TagLook; tooltip?: string; href?: string };

/** The tag type that each inherited plan adds to a latest page. */
export const inheritedPlanTags = {
  'Pilot program': 'restricted',
  'Add-on': 'addon',
  Business: 'business',
  Team: 'team',
  Start: 'start',
  Paid: 'paid',
  'Open source': 'mit',
} as const satisfies Record<string, PageTag['type']>;

/** The tag type that each inherited status adds to a latest page. */
export const inheritedStatusTags = {
  Deprecated: 'deprecated',
  Alpha: 'alpha',
  Beta: 'beta',
} as const satisfies Record<string, PageTag['type']>;

const pricingUrl = 'https://tiptap.dev/pricing';
const pilotProgramUrl = 'https://tiptap.dev/contact-sales?form=pilot-program';
const templateNote = ' Usage of this template is subject to our Pro License and ToS.';

/** The label for one tag, or null for a tag that shows nothing. */
export function tagLabel(
  tag: PageTag,
  version: 'latest' | 'v2',
  isTemplate: boolean,
): TagLabel | null {
  return version === 'latest' ? latestTagLabel(tag, isTemplate) : v2TagLabel(tag);
}

/** Latest labels: texts, tooltips and links as in the current docs' page header. */
function latestTagLabel(tag: PageTag, isTemplate: boolean): TagLabel | null {
  const tip = (fallback: string) => tag.tooltip || fallback;
  const license = isTemplate ? templateNote : '';
  const plan = (text: string, look: TagLook, tooltip: string, href = pricingUrl) => ({
    text,
    look,
    tooltip: tip(tooltip),
    href,
  });
  switch (tag.type) {
    case 'paid':
      return plan('Paid', 'neutral', 'Requires paid access to this feature.');
    case 'start':
    case 'beginStart':
      return plan(
        'Start plan',
        'neutral',
        `Included in Start, Team, Business, and Enterprise.${license}`,
      );
    case 'team':
      return plan('Team plan', 'neutral', `Included in Team, Business, and Enterprise.${license}`);
    case 'business':
      return plan('Business plan', 'neutral', 'Included in Business and Enterprise.');
    case 'addon':
      return plan('Paid add-on', 'neutral', 'Added to a paid plan.');
    case 'restricted':
      return plan(
        tag.label || 'Pilot program',
        'primary',
        'Contact our team to join the pilot program.',
        pilotProgramUrl,
      );
    case 'mit':
    case 'pro':
      return { text: 'Open source', look: 'primary', tooltip: tip('MIT licensed, free to use.') };
    case 'alpha':
      return { text: 'Alpha', look: 'primary', tooltip: tip('Works, but the API will change.') };
    case 'beta':
      return { text: 'Beta', look: 'primary', tooltip: tip('Works, but the API may change.') };
    case 'experiment':
      return { text: 'Experimental', look: 'neutral', tooltip: tip('May change or go away.') };
    case 'new':
      return { text: 'New', look: 'primary', tooltip: tag.tooltip };
    case 'deprecated':
      return {
        text: 'Deprecated',
        look: 'warning',
        tooltip: tip('Will be removed. Use what the page names instead.'),
      };
    case 'version':
      return { text: tag.label || 'Version', look: 'neutral', tooltip: tag.tooltip };
    default:
      return null;
  }
}

/** v2 labels. */
function v2TagLabel(tag: PageTag): TagLabel | null {
  const tip = (fallback?: string) => tag.tooltip || fallback;
  switch (tag.type) {
    case 'pro':
      return {
        text: 'Pro Extension',
        look: 'primary',
        tooltip: tip('Pro extensions require a Tiptap subscription.'),
      };
    case 'beginStart':
      return { text: 'Available from Start plan', look: 'neutral', tooltip: tip() };
    case 'start':
      return { text: 'Available in Start plan', look: 'neutral', tooltip: tip() };
    case 'addon':
      return {
        text: 'Paid add-on',
        look: 'neutral',
        tooltip: tip('Add this add-on to your subscription'),
      };
    case 'mit':
      return {
        text: 'Available for free',
        look: 'primary',
        tooltip: tip('Free to use under MIT license.'),
      };
    case 'team':
      return { text: 'Available in Team plan', look: 'neutral', tooltip: tip() };
    case 'business':
      return {
        text: 'Business plan',
        look: 'neutral',
        tooltip: tip('Integrate and use while subscribed to the Business or Enterprise plan.'),
      };
    case 'ai':
      return { text: 'Content AI', look: 'neutral', tooltip: tip() };
    case 'collaboration':
      return { text: 'Collaboration', look: 'neutral', tooltip: tip() };
    case 'documents':
      return { text: 'Documents', look: 'neutral', tooltip: tip() };
    case 'editor':
      return { text: 'Editor', look: 'neutral', tooltip: tip() };
    case 'new':
      return { text: 'New', look: 'primary', tooltip: tip() };
    case 'beta':
      return { text: 'Beta', look: 'primary', tooltip: tip() };
    case 'alpha':
      return { text: 'Alpha', look: 'primary', tooltip: tip() };
    case 'experiment':
      return { text: 'Experiment', look: 'neutral', tooltip: tip() };
    case 'restricted':
      return {
        text: tag.label || 'Pilot program',
        look: 'primary',
        tooltip: tip('Contact our team to join the pilot program.'),
        href: pilotProgramUrl,
      };
    case 'deprecated':
      return {
        text: 'Deprecated',
        look: 'warning',
        tooltip: tip(
          'This extension is being deprecated in 2026 and will be replaced by AI Toolkit.',
        ),
      };
    case 'version':
      return { text: tag.label || 'Version', look: 'neutral', tooltip: tip() };
    default:
      return null;
  }
}

/** The incident severity label, shown for `high` and `critical` only. */
export function severityLabel(severity?: string): TagLabel | null {
  if (severity !== 'high' && severity !== 'critical') return null;
  return {
    text: `Severity: ${severity.charAt(0).toUpperCase()}${severity.slice(1)}`,
    look: 'warning',
  };
}
