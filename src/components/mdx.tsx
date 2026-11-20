import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { CardFilter } from '@/components/card-filter';
import { CatalogCard } from '@/components/catalog-card';
import { CodeDemo } from '@/components/code-demo';
import { DemoViewer } from '@/components/demo-viewer/demo-viewer';
import { EnterpriseCard } from '@/components/enterprise-card';
import { FeatureCard } from '@/components/feature-card';
import { HeaderDemo } from '@/components/header-demo';
import { IncidentCard } from '@/components/incident-card';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Accordions,
    Accordion,
    CardFilter,
    CatalogCard,
    CodeDemo,
    DemoViewer,
    EnterpriseCard,
    FeatureCard,
    HeaderDemo,
    IncidentCard,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
