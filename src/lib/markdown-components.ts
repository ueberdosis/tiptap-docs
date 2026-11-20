import { asMarkdown, md } from 'fumadocs-core/server';
import type { MDXComponents } from 'mdx/types';
import type { ReactNode } from 'react';
import { getDemoBaseUrl } from '@/lib/demo-base-urls';
import enterpriseContent from '@/lib/enterprise-content.json';
import type { VersionName } from '@/lib/versions';

type Children = { children?: ReactNode };

const defaultContactUrl = 'https://tiptap.dev/contact-sales?form=ai-toolkit';

/** Renders `node` to Markdown on one line. */
async function inline(node: ReactNode) {
  return (await md`${node}`).trim().replace(/\s*\n\s*/g, ' ');
}

/** One list line: `- [title](url): description`. Without `url`, the title is bold. */
async function listItem(title: ReactNode, url: string | undefined, description: ReactNode) {
  const name = await inline(title);
  const text = await inline(description);
  const link = url ? `[${name}](${url})` : `**${name}**`;
  return `- ${link}${text ? `: ${text}` : ''}\n`;
}

/** Renders the children only. */
function ChildrenOnly({ children }: Children) {
  asMarkdown();
  return md`${children}`;
}

/** Renders nothing. */
function Nothing() {
  asMarkdown();
  return '';
}

async function Callout({ title, type, children }: Children & { title?: ReactNode; type?: string }) {
  asMarkdown();
  const heading = title ?? (type ? type.charAt(0).toUpperCase() + type.slice(1) : undefined);
  const body = (await md`${children}`).trim();
  if (heading === undefined) return md.linePrefix('> ')`${body}`;
  return md.linePrefix('> ')`**${heading}**

${body}`;
}

function Accordion({ title, children }: Children & { title?: ReactNode }) {
  asMarkdown();
  return md`
**${title}**

${children}

`;
}

/** A card list: list lines without blank lines between them. */
async function Cards({ children }: Children) {
  asMarkdown();
  const text = (await md`${children}`).trim().replace(/\n\s*\n(?=- )/g, '\n');
  return `\n${text}\n\n`;
}

function Card({ title, href, children }: Children & { title?: ReactNode; href?: string }) {
  asMarkdown();
  return listItem(title, href, children);
}

function FeatureCard({
  title,
  href,
  actions = [],
  children,
}: Children & { title?: ReactNode; href?: string; actions?: { href: string }[] }) {
  asMarkdown();
  return listItem(title, href ?? actions[0]?.href, children);
}

function EnterpriseCard({ variant }: { variant: string }) {
  asMarkdown();
  const content = (enterpriseContent as Record<string, Record<string, unknown>>)[variant];
  if (!content) throw new Error(`<EnterpriseCard> has an unknown variant "${variant}"`);
  const url = (content.contactUrl as string | undefined) ?? defaultContactUrl;
  return md`
${listItem(content.title as string, url, content.description as string)}
`;
}

type CodeDemoProps = { src?: string; path?: string; isPro?: boolean; externalTitle?: string };

function CodeDemo({
  src,
  path = '',
  isPro,
  externalTitle,
  version,
}: CodeDemoProps & { version: VersionName }) {
  asMarkdown();
  const url = src || getDemoBaseUrl(version, isPro) + path;
  const last = url.split('?')[0].split('/').filter(Boolean).pop();
  const name = externalTitle || (last ? last.replace(/[-_]/g, ' ') : 'Open demo');
  return md.linePrefix('> ')`**Interactive demo:** [${name}](${url})`;
}

const codeDemos: Record<VersionName, (props: CodeDemoProps) => Promise<string>> = {
  latest: (props) => CodeDemo({ ...props, version: 'latest' }),
  v2: (props) => CodeDemo({ ...props, version: 'v2' }),
};

/**
 * Markdown forms of the components in the docs content, for `getText('processed')` of one docs
 * version. Reading a component that has no Markdown form throws an error that names it.
 */
export function getMarkdownComponents(version: VersionName): MDXComponents {
  const components: MDXComponents = {
    Accordion,
    Accordions: ChildrenOnly,
    ArrowRightIcon: Nothing,
    Callout,
    Card,
    Cards,
    CatalogCard: Card,
    CodeDemo: codeDemos[version],
    EnterpriseCard,
    FeatureCard,
    HeaderDemo: codeDemos[version],
    IncidentCard: Card,
  };
  return new Proxy(components, {
    get(target, key) {
      if (typeof key === 'string' && /^[A-Z]/.test(key) && !Object.hasOwn(target, key)) {
        throw new Error(`<${key}> has no Markdown form`);
      }
      return Reflect.get(target, key);
    },
  });
}
