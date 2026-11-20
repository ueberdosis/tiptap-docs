type Node = {
  type: string;
  name?: string | null;
  children?: Node[];
  attributes?: { type: string; name?: string; value?: unknown }[];
};

/** Props of one sidebar `EnterpriseCard`. */
export type EnterpriseCardData = { variant: string; disableWaitlist: boolean };

const isSidebarCard = (node: Node) =>
  (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') &&
  node.name === 'EnterpriseCard' &&
  !node.attributes?.some(
    (attribute) => attribute.name === 'renderMode' && attribute.value !== 'sidebar',
  );

/**
 * Remark plugin. Writes the props of top-level `EnterpriseCard` elements with
 * `renderMode="sidebar"` (or no `renderMode`) to `file.data.enterpriseCards`, in page order.
 * Throws an error that names the page if such a card is not at top level, or has a prop that is
 * not a plain string or boolean.
 */
export function remarkEnterpriseCards() {
  return (tree: Node, file: { path?: string; data: Record<string, unknown> }) => {
    const cards: EnterpriseCardData[] = [];
    const fail = (message: string): never => {
      throw new Error(`${file.path}: <EnterpriseCard> ${message}`);
    };

    const visit = (node: Node, topLevel: boolean) => {
      if (isSidebarCard(node)) {
        if (!topLevel) fail('with renderMode="sidebar" is not at top level');
        const card: EnterpriseCardData = { variant: '', disableWaitlist: false };
        for (const attribute of node.attributes ?? []) {
          if (attribute.type !== 'mdxJsxAttribute') fail('has a spread prop');
          if (attribute.name === 'variant' && typeof attribute.value === 'string') {
            card.variant = attribute.value;
          } else if (attribute.name === 'disableWaitlist' && attribute.value == null) {
            card.disableWaitlist = true;
          } else if (attribute.name !== 'renderMode') {
            fail(`has an unsupported prop "${attribute.name}"`);
          }
        }
        if (!card.variant) fail('has no variant');
        cards.push(card);
      }
      for (const child of node.children ?? []) visit(child, node === tree);
    };
    visit(tree, false);
    file.data.enterpriseCards = cards;
  };
}
