import type { PageTag } from '@/lib/page-schema';

export type TagLook = 'neutral' | 'primary' | 'warning';

/** Text, look and optional tooltip and link of one page label. */
export type TagLabel = { text: string; look: TagLook; tooltip?: string; href?: string };

const pilotProgramUrl = 'https://tiptap.dev/contact-sales?form=pilot-program';
const templateNote = ' Usage of this template is subject to our Pro License and ToS.';

/** The label for one tag, or null for a tag that shows nothing. */
export function tagLabel(
  tag: PageTag,
  version: 'latest' | 'v2',
  isTemplate: boolean,
): TagLabel | null {
  const tip = (fallback?: string) => tag.tooltip || fallback;
  const plan = (name: string) => {
    if (version === 'v2') return tip();
    const text = `Integrate and use while subscribed to the ${name} plan.`;
    return tip(isTemplate ? text + templateNote : text);
  };
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
      return { text: 'Available in Start plan', look: 'neutral', tooltip: plan('Start') };
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
      return { text: 'Available in Team plan', look: 'neutral', tooltip: plan('Team') };
    case 'business':
      return {
        text: 'Business plan',
        look: 'neutral',
        tooltip: tip('Integrate and use while subscribed to the Business or Enterprise plan.'),
      };
    case 'ai':
      return {
        text: version === 'v2' ? 'Content AI' : 'AI Toolkit',
        look: 'neutral',
        tooltip: tip(),
      };
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
