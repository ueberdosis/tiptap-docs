/**
 * Reads `VARIANT_CONFIG` from `src/components/EnterpriseCallout.tsx` of `tiptap-docs-main` and
 * writes its values unchanged to `src/lib/enterprise-content.json`, one entry per variant, in
 * source order. Stops with an error if the config is missing or has a field or value it does not
 * know.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { loadBindings, parse as parseTsx } from 'next/dist/build/swc/index.js';

const appDir = dirname(import.meta.dirname);
const sourceFile = join(
  import.meta.dirname,
  '.sources/tiptap-docs-main/src/components/EnterpriseCallout.tsx',
);
const outputFile = join(appDir, 'src/lib/enterprise-content.json');

type EsNode = { type: string; [key: string]: unknown };

const fieldTypes: Record<string, 'string' | 'boolean'> = {
  title: 'string',
  description: 'string',
  showWaitlist: 'boolean',
  contactUrl: 'string',
  buttonText: 'string',
};
const requiredFields = ['title', 'description', 'showWaitlist'];

const fail = (message: string): never => {
  throw new Error(`EnterpriseCallout.tsx: ${message}`);
};

/** Returns the name of an object key. Throws on computed keys. */
const keyName = (key: EsNode) => {
  if (key.type === 'Identifier' || key.type === 'StringLiteral') return key.value as string;
  return fail(`VARIANT_CONFIG has a key of type ${key.type}`);
};

/** Returns the properties of an object literal. Throws on spreads and shorthand. */
const objectProperties = (node: EsNode, where: string) => {
  if (node.type !== 'ObjectExpression') fail(`${where} is not an object literal`);
  return (node.properties as EsNode[]).map((property) => {
    if (property.type !== 'KeyValueProperty') fail(`${where} has a ${property.type}`);
    return [keyName(property.key as EsNode), property.value as EsNode] as const;
  });
};

const findConfig = (node: unknown): EsNode | undefined => {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findConfig(child);
      if (found) return found;
    }
    return;
  }
  const value = node as EsNode;
  if (
    value.type === 'VariableDeclarator' &&
    (value.id as EsNode).type === 'Identifier' &&
    (value.id as EsNode).value === 'VARIANT_CONFIG'
  ) {
    return (value.init as EsNode | undefined) ?? fail('VARIANT_CONFIG has no value');
  }
  return findConfig(Object.values(value));
};

await loadBindings();
const program = await parseTsx(readFileSync(sourceFile, 'utf8'), {
  isModule: true,
  filename: sourceFile,
  jsc: { parser: { syntax: 'typescript', tsx: true } },
});
const config = findConfig(program) ?? fail('VARIANT_CONFIG not found');

const content: Record<string, Record<string, string | boolean>> = {};
for (const [variant, value] of objectProperties(config, 'VARIANT_CONFIG')) {
  const entry: Record<string, string | boolean> = {};
  for (const [field, fieldValue] of objectProperties(value, `variant "${variant}"`)) {
    const type = fieldTypes[field] ?? fail(`variant "${variant}" has an unknown field "${field}"`);
    const literal = type === 'string' ? 'StringLiteral' : 'BooleanLiteral';
    if (fieldValue.type !== literal) {
      fail(`variant "${variant}" field "${field}" is not a ${type} literal`);
    }
    entry[field] = fieldValue.value as string | boolean;
  }
  for (const field of requiredFields) {
    if (!(field in entry)) fail(`variant "${variant}" has no field "${field}"`);
  }
  content[variant] = entry;
}

writeFileSync(outputFile, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Wrote ${Object.keys(content).length} enterprise card variants`);
