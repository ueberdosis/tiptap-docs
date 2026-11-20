/**
 * Fetches `packages/<name>/CHANGELOG.md` of the Tiptap repositories from GitHub and writes one
 * Markdown page per package plus `index.json` (slug and package name, sorted by package name) to
 * `.changelogs/`. Deletes the folder first. Packages without a `CHANGELOG.md` are skipped; any
 * other failed request stops the script.
 *
 * Needs `GITHUB_TOKEN` with read access to `ueberdosis/tiptap-pro`.
 * `SKIP_CHANGELOGS=1` writes an empty index instead and fetches nothing.
 */
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

type Repo = { repo: string; slugPrefix: string; packageScope: string };

type Changelog = { slug: string; packageName: string; content: string };

const owner = 'ueberdosis';
const branch = 'main';
const packagesDir = 'packages';
const concurrency = 5;
const outDir = join(import.meta.dirname, '..', '.changelogs');

const repos: Repo[] = [
  { repo: 'tiptap', slugPrefix: '', packageScope: '@tiptap' },
  { repo: 'tiptap-pro', slugPrefix: 'pro-', packageScope: '@tiptap-pro' },
];

const omittedPackages = new Set([
  '@tiptap-pro/extension-ai-advanced',
  '@tiptap-pro/extension-annotation',
  '@tiptap-pro/extension-iframely',
  '@tiptap-pro/extension-document-colors',
  '@tiptap-pro/server-ai-toolkit',
]);

/** Fetches a path of a repository through the GitHub contents API. Returns `null` on 404. */
async function fetchContents(
  repo: string,
  path: string,
  accept: string,
  token: string,
): Promise<Response | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub request for ${owner}/${repo}/${path} failed: HTTP ${response.status} ${body.slice(0, 200)}`,
    );
  }
  return response;
}

async function listPackages(repo: string, token: string): Promise<string[]> {
  const response = await fetchContents(repo, packagesDir, 'application/vnd.github+json', token);
  if (!response) throw new Error(`GitHub request for ${owner}/${repo}/${packagesDir} failed: 404`);
  const entries = (await response.json()) as { name: string; type: string }[];
  return entries.filter((entry) => entry.type === 'dir').map((entry) => entry.name);
}

function stripLeadingH1(markdown: string): string {
  return markdown.replace(/^\s*#\s+[^\n]+\n*/, '');
}

function stripCommitHashes(markdown: string): string {
  return markdown
    .replace(/^(\s*-\s+)[0-9a-fA-F]{1,7}:\s+/gm, '$1')
    .replace(/^(\s*-\s+Updated dependencies) \[[0-9a-fA-F]{1,7}\]/gm, '$1');
}

async function fetchChangelog(
  { repo, slugPrefix, packageScope }: Repo,
  folder: string,
  token: string,
): Promise<Changelog | null> {
  const packageName = `${packageScope}/${folder}`;
  const path = `${packagesDir}/${folder}/CHANGELOG.md`;
  const response = await fetchContents(repo, path, 'application/vnd.github.raw', token);
  if (!response) {
    console.log(`Skipped ${packageName}: no ${owner}/${repo}/${path}`);
    return null;
  }
  const content = stripCommitHashes(stripLeadingH1(await response.text()));
  return { slug: `${slugPrefix}${folder}`, packageName, content };
}

/** Runs `fn` on every item with at most `limit` calls at a time. Keeps the item order. */
async function mapLimited<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function page({ packageName, content }: Changelog): string {
  const title = `${packageName} changelog`;
  const description = `Changelog for ${packageName}`;
  const frontmatter = `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(description)}\n---`;
  return `${frontmatter}\n\n${content.trim()}\n`;
}

function write(changelogs: Changelog[]) {
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  for (const changelog of changelogs) {
    writeFileSync(join(outDir, `${changelog.slug}.md`), page(changelog));
  }
  const index = changelogs.map(({ slug, packageName }) => ({ slug, packageName }));
  writeFileSync(join(outDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`);
}

async function main() {
  if (process.env.SKIP_CHANGELOGS === '1') {
    write([]);
    console.log('SKIP_CHANGELOGS=1: wrote an empty changelog index, fetched nothing.');
    return;
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      'GITHUB_TOKEN is not set. It needs read access to ueberdosis/tiptap-pro. ' +
        'Set SKIP_CHANGELOGS=1 to build without package changelogs.',
    );
  }

  const changelogs: Changelog[] = [];
  for (const repo of repos) {
    const folders = (await listPackages(repo.repo, token))
      .filter((folder) => !omittedPackages.has(`${repo.packageScope}/${folder}`))
      .sort();
    const results = await mapLimited(folders, concurrency, (folder) =>
      fetchChangelog(repo, folder, token),
    );
    const found = results.filter((result) => result !== null);
    console.log(`${owner}/${repo.repo}: ${found.length} changelogs`);
    changelogs.push(...found);
  }

  changelogs.sort((a, b) => a.packageName.localeCompare(b.packageName, 'en'));
  write(changelogs);
  console.log(`Wrote ${changelogs.length} changelogs to .changelogs/`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
