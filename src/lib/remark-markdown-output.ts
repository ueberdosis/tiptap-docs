import { replaceSource } from 'fumadocs-core/mdx-plugins/stringifier';

type Node = {
  type: string;
  name?: string | null;
  value?: string;
  children?: Node[];
  data?: { estree?: { body: { type: string; expression?: Expression }[] } };
};

type Expression = {
  type: string;
  value?: unknown;
  expressions?: unknown[];
  quasis?: { value: { cooked?: string | null } }[];
};

/** Components whose children stay in the processed Markdown, without the component. */
const childrenOnly = new Set(['CardFilter', 'CardFilter.Item', 'CardFilter.Group']);

/**
 * `filterElement` for `includeProcessedMarkdown`. Keeps only the children of `CardFilter` and its
 * parts. Throws for any other component with a dotted name, which the Markdown output can not
 * convert.
 */
export function filterMarkdownElement(node: {
  type: string;
  name?: string | null;
}): boolean | 'children-only' {
  if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') return true;
  if (node.name && childrenOnly.has(node.name)) return 'children-only';
  if (node.name?.includes('.')) throw new Error(`<${node.name}> has no Markdown form`);
  return true;
}

/** The text of an expression, or `undefined` when it is not empty, a comment or plain text. */
function expressionText(node: Node): string | undefined {
  const body = node.data?.estree?.body ?? [];
  if (body.length === 0) return '';
  const expression = body.length === 1 ? body[0].expression : undefined;
  if (expression?.type === 'Literal' && typeof expression.value === 'string') {
    return expression.value;
  }
  if (expression?.type === 'TemplateLiteral' && expression.expressions?.length === 0) {
    return expression.quasis?.[0]?.value.cooked ?? undefined;
  }
  return undefined;
}

/**
 * Remark plugin. Sets the processed-Markdown text of each MDX expression: nothing for an empty or
 * comment-only expression, the value for a string or a template literal without placeholders.
 * Throws an error that names the page for any other expression. The HTML output is unchanged.
 */
export function remarkMarkdownExpressions() {
  return (tree: Node, file: { path?: string }) => {
    const visit = (node: Node) => {
      if (node.type === 'mdxFlowExpression' || node.type === 'mdxTextExpression') {
        const text = expressionText(node);
        if (text === undefined) {
          throw new Error(`${file.path}: the expression {${node.value}} has no Markdown form`);
        }
        type Args = Parameters<typeof replaceSource>;
        replaceSource(file as Args[0], node as Args[1], text);
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
