import { basename, extname } from 'node:path';
import { getBreadcrumbItems } from 'fumadocs-core/breadcrumb';
import { type AdvancedIndex, createSearchAPI } from 'fumadocs-core/search/server';
import { matchesPerPage, rankingPlugin } from '@/lib/search/ranking';
import { isPackageChangelog, source, v2Source } from '@/lib/source';
import type { VersionName } from '@/lib/versions';

/**
 * Search indexes of the pages of a version, tagged with the version name.
 * Package changelogs are left out.
 */
function versionIndexes(docs: typeof source | typeof v2Source, tag: VersionName): AdvancedIndex[] {
  const tree = docs.getPageTree();
  return docs
    .getPages()
    .filter((page) => !isPackageChangelog(page))
    .map((page) => ({
      id: page.url,
      url: page.url,
      title: page.data.title ?? basename(page.path, extname(page.path)),
      description: page.data.description,
      structuredData: page.data.structuredData,
      breadcrumbs: getBreadcrumbItems(page.url, tree, { includeSeparator: true }).flatMap((item) =>
        typeof item.name === 'string' ? [item.name] : [],
      ),
      tag,
    }));
}

export const { GET } = createSearchAPI('advanced', {
  indexes: [...versionIndexes(source, 'latest'), ...versionIndexes(v2Source, 'v2')],
  plugins: [rankingPlugin],
  search: { groupBy: { properties: ['page_id'], maxResult: matchesPerPage } },
});
