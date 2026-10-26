// The docs MCP server and llms.txt, without a running site.
// Run with `pnpm test:structure`.

const assert = require('node:assert/strict')
const { test } = require('node:test')

const routes = require('./helpers/routes.cjs')

// The site's TypeScript needs ts-node and the `@/` alias, so load it after registering them
routes.registerTs()
const { handleMcpMessage, toRoute } = loadSite('../src/server/mcp.ts')
const { buildLlmsTxt, markdownUrl } = loadSite('../src/server/llmsText.ts')
const { fileForRoute, getDocsIndex } = loadSite('../src/server/getDocsIndex.ts')
const { readFrontmatterSync } = loadSite('../src/server/readFrontmatter.ts')
const { fileToMarkdown } = loadSite('../src/server/markdown/fileToMarkdown.ts')
const { getCatalog } = loadSite('../src/server/getCatalog.ts')
const { EDITOR_PRESETS } = loadSite('../src/content/presets.ts')
const { nextSteps, planEditor } = loadSite('../src/utils/planEditor.ts')
const { INDUSTRIES } = loadSite('../src/content/industries.ts')
const { sidebarConfig } = loadSite('../src/content/sidebar.ts')
const { sidebarLabel } = loadSite('../src/components/SidebarRenderer.tsx')
const { headerTags } = loadSite('../src/components/PageHeader.tsx')
const { isNew, NEW_FOR_DAYS } = loadSite('../src/utils/isNew.ts')
const { LEGACY_FEATURES, legacyFeature } = loadSite('../src/content/legacy.ts')
const { compareVersions, mainPackage, parseChangelog } = loadSite(
  '../src/server/changelogEntries.ts',
)

function loadSite(file) {
  return require(file)
}

const call = (method, params, id = 1) => handleMcpMessage({ jsonrpc: '2.0', id, method, params })
const tool = async (name, args) => {
  const response = await call('tools/call', { name, arguments: args })
  assert.equal(response.error, undefined, JSON.stringify(response.error))
  return response.result
}

test('initialize answers with a supported protocol version and the tools capability', async () => {
  const response = await call('initialize', {
    protocolVersion: '2025-06-18',
    capabilities: {},
    clientInfo: { name: 'test', version: '1' },
  })
  assert.equal(response.result.protocolVersion, '2025-06-18')
  assert.deepEqual(response.result.capabilities, { tools: { listChanged: false } })
  assert.equal(response.result.serverInfo.name, 'tiptap-docs')

  const fallback = await call('initialize', { protocolVersion: '1999-01-01' })
  assert.equal(fallback.result.protocolVersion, '2025-06-18')
})

test('notifications get no answer and unknown methods an error', async () => {
  assert.equal(
    await handleMcpMessage({ jsonrpc: '2.0', method: 'notifications/initialized' }),
    null,
  )
  assert.equal((await call('resources/list')).error.code, -32601)
  assert.equal((await handleMcpMessage({ id: 1, method: 'ping' })).error.code, -32600)
})

test('tools/list offers search_docs, get_page, list_features and plan_editor', async () => {
  const { result } = await call('tools/list')
  assert.deepEqual(
    result.tools.map((t) => t.name),
    ['search_docs', 'get_page', 'list_features', 'plan_editor'],
  )
})

test('search_docs finds the page a reader means', async () => {
  const { content } = await tool('search_docs', { query: 'comments install' })
  assert.match(content[0].text, /\/comments\/getting-started\/install\.md/)

  const bold = await tool('search_docs', { query: 'bold', limit: 3 })
  assert.match(bold.content[0].text.split('\n\n')[0], /Bold extension/)

  const first = async (query) =>
    (await tool('search_docs', { query, limit: 3 })).content[0].text.split('\n\n')[0]
  // The feature's overview, by its name, ahead of its subpages
  assert.match(await first('tracked changes'), /tracked-changes\/getting-started\/overview\.md/)
  // Current features ahead of deprecated and legacy ones
  assert.match(await first('compare two documents diff'), /\/compare\//)
  // A rough stem: "autocomplete" finds "Autocompletion"
  assert.match(await first('autocomplete'), /Autocompletion/)
  // Words like "add" and "my" don't decide
  assert.match(await first('add comments to my editor'), /\/comments\//)
})

test('get_page returns Markdown with section and plan, and follows redirects', async () => {
  const page = await tool('get_page', { path: '/comments/getting-started/install' })
  assert.match(page.content[0].text, /^---\n/)
  assert.match(page.content[0].text, /section: "Features › Review › Comments"/)
  assert.match(page.content[0].text, /plan: "Start"/)

  const viaUrl = await tool('get_page', {
    path: 'https://tiptap.dev/docs/editor/extensions/marks/bold.md',
  })
  assert.match(viaUrl.content[0].text, /title: "Bold extension"/)
  assert.match(viaUrl.content[0].text, /package: "@tiptap\/extension-bold"/)

  // /guides/spellcheck moved to /editor/guides/spellcheck
  const moved = await tool('get_page', { path: '/guides/spellcheck' })
  assert.match(moved.content[0].text, /editor\/guides\/spellcheck/)

  const missing = await tool('get_page', { path: '/editor/not-a-page' })
  assert.equal(missing.isError, true)
})

test('list_features filters by plan and area', async () => {
  const { content } = await tool('list_features', { plan: 'Add-on' })
  assert.match(content[0].text, /Tracked Changes \[Add-on\]/)
  assert.doesNotMatch(content[0].text, /\[Open source\]/)

  const editor = await tool('list_features', { area: 'editor', query: 'table' })
  assert.match(editor.content[0].text, /Table kit/)

  // An announced feature is no promise, and points to what covers the need today
  const footnotes = await tool('list_features', { query: 'footnotes' })
  assert.match(
    footnotes.content[0].text,
    /Footnotes \[Paid, Soon\][^\n]*not available yet, no release date; today use footnotes in Pages/,
  )

  // The status filter matches the catalog's
  const legacy = await tool('list_features', { status: 'Legacy' })
  assert.match(legacy.content[0].text, /Pages \[Team, Legacy\]/)
  assert.doesNotMatch(legacy.content[0].text, /Comments \[/)

  // Plan and status together, so a legacy or beta feature shows both
  const pages = await tool('list_features', { query: 'pages' })
  assert.match(pages.content[0].text, /Pages \[Team, Legacy\]/)
})

test('llms.txt marks legacy pages and says what Legacy means', () => {
  const llms = buildLlmsTxt()
  assert.match(llms, /Entries marked \(Legacy\)/)
  assert.match(llms, /pages\/getting-started\/overview\.md\) \[Team\] \(Legacy\)/)
})

test('toRoute accepts paths, docs URLs and .md URLs', () => {
  assert.equal(toRoute('editor/extensions/marks/bold'), '/editor/extensions/marks/bold')
  assert.equal(toRoute('https://tiptap.dev/docs/comments.md'), '/comments')
  assert.equal(toRoute('/hosting/'), '/hosting')
})

test('llms.txt lists every page once, grouped like the sidebar', () => {
  const llms = buildLlmsTxt()
  for (const route of routes.listPageRoutes()) {
    const md = `(${markdownUrl(route)})`
    assert.equal(llms.split(md).length - 1, 1, `${route} appears once in llms.txt`)
  }
  assert.match(llms, /\n## Features\n/)
  assert.match(llms, /\n### Review › Comments\n/)
  assert.doesNotMatch(llms, /\/_[a-z]/, 'partials stay out of llms.txt')
  assert.equal(getDocsIndex().length, new Set(getDocsIndex().map((page) => page.route)).size)
})

test('subpages of paid features carry their plan, and old AI pages are legacy', () => {
  const pages = getDocsIndex()
  const under = (prefix) => pages.filter((page) => page.route.startsWith(prefix))
  const paid = ['/comments/', '/tracked-changes/', '/compare/', '/collaboration/', '/conversion/']
  for (const prefix of [...paid, '/ai/ai-toolkit/', '/ai/basic/', '/pages/', '/composable-docs/']) {
    const missing = under(prefix).filter((page) => !page.plan || page.plan === 'Open source')
    assert.deepEqual(
      missing.map((page) => page.route),
      [],
      `${prefix} pages without a paid plan`,
    )
  }
  const current = under('/ai/deprecated/').filter((page) => page.status !== 'Legacy')
  assert.deepEqual(
    current.map((page) => page.route),
    [],
  )
})

test('.md pages link the code of open-source demos, not of Pro demos', async () => {
  const bold = await fileToMarkdown('src/content/editor/extensions/marks/bold.mdx')
  assert.match(
    bold,
    /\*\*Source code:\*\* \[demos\/src\/Marks\/Bold\]\(https:\/\/github\.com\/ueberdosis\/tiptap\/tree\/main\/demos\/src\/Marks\/Bold\)/,
  )

  const comments = await fileToMarkdown('src/content/comments/getting-started/overview.mdx')
  assert.match(comments, /\*\*Interactive demo:\*\*/)
  assert.doesNotMatch(comments, /Source code:/)
})

const documented = () => getCatalog().filter((entry) => entry.url)

test('.md pages keep raw links, page-defined cards, the feature catalog and JSX captions', async () => {
  const toolkit = await fileToMarkdown('src/content/ai/ai-toolkit/overview.mdx')
  assert.match(toolkit, /\[Contact our team\]\(https:\/\/tiptap\.dev\/contact-sales/)

  const reference = await fileToMarkdown('src/content/conversion/content-types/overview.mdx')
  assert.match(reference, /- \[Paragraphs\]\([^)]+paragraphs\.md\): Text content/)

  const catalog = await fileToMarkdown('src/content/editor/extensions/overview.mdx')
  assert.match(catalog, /## \[Text formatting\]/)
  assert.match(catalog, /- \[Comments\]\([^)]+\) \([^)]*(Start|Team)[^)]*\)/)

  const pages = await fileToMarkdown('src/content/pages/getting-started/overview.mdx')
  assert.doesNotMatch(pages, /\\<strong>|<strong>/)
})

test('.md pages include the partials they import', async () => {
  const styles = await fileToMarkdown('src/content/conversion/export/odt/styles.mdx')
  assert.ok(styles.split('\n').length > 200, 'the styles guide partial is inlined')
  const rest = await fileToMarkdown('src/content/conversion/export/docx/rest-api.mdx')
  assert.match(rest, /api-us\.tiptap\.dev/)
  assert.doesNotMatch(rest, /^import /m)
})

test('the sidebar labels paid features once, and mixed groups not at all', () => {
  const find = (entries, path) => {
    const [title, ...rest] = path
    const entry = entries.find((candidate) => candidate.title === title)
    return rest.length ? find(entry.children, rest) : entry
  }
  const features = sidebarConfig.items.find((group) => group.title === 'Features').children
  const label = (path) => {
    const entry = find(features, path)
    return sidebarLabel(entry.tags, entry.hidePlan)?.text
  }

  // A group whose features all need a plan says Paid, whichever plans they need
  assert.equal(label(['Review']), 'Paid')
  assert.equal(label(['Review', 'Comments']), undefined, 'repeats the group')
  assert.equal(label(['Composable Documents']), 'Paid')
  assert.equal(label(['Composable Documents', 'Slots']), undefined, 'repeats its feature')
  // AI Legacy is paid too, so all of AI is; the end of life still shows
  assert.equal(label(['AI']), 'Paid')
  assert.equal(label(['AI', 'Server AI Toolkit']), undefined)
  assert.equal(label(['AI', 'AI Legacy']), 'Legacy')
  // Upcoming features that will be paid make their group paid; they show Soon
  assert.equal(label(['Page Layout']), 'Paid')
  assert.equal(label(['Page Layout', 'Page Layout']), 'Soon')
  assert.equal(label(['Document structure']), 'Paid')
  // A group that mixes free and paid features says nothing; the paid ones do
  assert.equal(label(['Clipboard and files']), undefined)
  assert.equal(label(['Clipboard and files', 'Paste handler']), 'Paid')
  assert.equal(label(['Compare', 'Compare snapshots']), 'Legacy')
  // Paid products and paid editor groups come first, the open source editor's groups after them
  const at = (title) => features.findIndex((entry) => entry.title === title)
  assert.ok(at('AI') < at('Starter kit'))
  assert.ok(at('Whiteboard') < at('Document structure'))
  assert.ok(at('Document structure') < at('Starter kit'))
  // Beta stays out of the sidebar
  assert.equal(sidebarLabel(['Beta', 'Start'])?.text, 'Paid')
  assert.equal(sidebarLabel(['Beta']), undefined)
})

test('page headers show the plan and status a page inherits, unless it has its own', () => {
  const page = getDocsIndex().find((entry) => entry.route === '/ai/ai-toolkit/agents/streaming')
  const types = (tags) => tags.map((tag) => tag.type)
  assert.deepEqual(types(headerTags([], page)), ['addon', 'alpha'])
  // Its own tags win over the inherited ones
  assert.deepEqual(types(headerTags([{ type: 'team' }, { type: 'beta' }], page)), ['team', 'beta'])
  assert.deepEqual(types(headerTags(undefined, undefined)), [])
})

test('"New" carries the day a page went live, and goes away after 90 days', () => {
  const now = Date.parse('2026-10-24')
  assert.equal(isNew('2026-10-01', now), true)
  assert.equal(isNew('2026-07-01', now), false)
  assert.equal(isNew(undefined, now), false)

  // Stale or undated "New" fails here, so it gets cleaned up
  const stale = []
  const visit = (entries, file) => {
    for (const entry of entries ?? []) {
      if ((entry.tags ?? []).some((tag) => tag.toLowerCase() === 'new')) {
        stale.push(`${file}: ${entry.title} uses a New tag; set newSince instead`)
      }
      if (entry.newSince && !isNew(entry.newSince)) {
        stale.push(`${file}: ${entry.title} is older than ${NEW_FOR_DAYS} days`)
      }
      visit(entry.children, file)
    }
  }
  for (const { file, config } of routes.loadSidebars()) visit(config.items, file)
  for (const page of getDocsIndex()) {
    const file = fileForRoute(page.route)
    const tag = file && (readFrontmatterSync(file).tags ?? []).find((t) => t.type === 'new')
    if (tag && !isNew(tag.since)) stale.push(`${page.route}: New without a recent since date`)
  }
  assert.deepEqual(stale, [])
})

test('changelogs split into changes, without dependency and license noise', () => {
  const changes = parseChangelog(
    [
      '## 3.32.0',
      '',
      '### Minor Changes',
      '',
      '- Add the `schemaSpec` option.',
      '  It takes a schema.',
      '',
      '### Patch Changes',
      '',
      '- Fix list toggling.',
      '- Updated dependencies',
      '  - @tiptap/pm@3.32.0',
      '- @tiptap/core@3.32.0',
      '- License updates',
      '',
      '## 3.31.4',
      '',
      '### Major Changes',
      '',
      '- Drop Node 18.',
    ].join('\n'),
  )
  assert.deepEqual(
    changes.map(({ version, type, text }) => [version, type, text]),
    [
      ['3.32.0', 'New', 'Add the `schemaSpec` option.\nIt takes a schema.'],
      ['3.32.0', 'Fixed', 'Fix list toggling.'],
      ['3.31.4', 'Breaking', 'Drop Node 18.'],
    ],
  )
  assert.deepEqual(['3.0.0-beta.2', '3.31.4', '3.32.0', '3.0.0', '3.10.0'].sort(compareVersions), [
    '3.32.0',
    '3.31.4',
    '3.10.0',
    '3.0.0',
    '3.0.0-beta.2',
  ])
  // A feature's history is the package it is named after, not the first one it installs
  assert.equal(
    mainPackage({
      name: 'Pages',
      package: '@tiptap-pro/extension-convert-kit @tiptap-pro/extension-pages',
    }),
    '@tiptap-pro/extension-pages',
  )
})

test('every add-on says how to get it', () => {
  const { ADD_ON_ACCESS } = loadSite('../src/content/access.ts')
  const missing = getCatalog()
    .filter((entry) => entry.plan === 'Add-on' && entry.url && !ADD_ON_ACCESS[entry.name])
    .map((entry) => entry.name)
  assert.deepEqual(missing, [], 'add these to src/content/access.ts')
})

test('the full text comes per section, without legacy pages', () => {
  const { getLlmsSections, sectionUrl } = loadSite('../src/server/llmsFull.ts')
  const sections = getLlmsSections()
  const pages = sections.flatMap((section) => section.pages)
  assert.equal(pages.filter((page) => page.status === 'Legacy').length, 0)
  assert.equal(new Set(sections.map((section) => section.id)).size, sections.length)
  assert.ok(sections.some((section) => section.title === 'Editor features'))
  const llms = buildLlmsTxt(
    sections.map((section) => ({
      title: section.title,
      url: sectionUrl(section.id),
      tokens: 1000,
    })),
  )
  assert.match(llms, /## Full text by section/)
  assert.match(llms, /\[Review\]\([^)]+\/llms-full\/review\.txt\) \(about 1,000 tokens\)/)
})

test('every documented feature names its npm package', () => {
  const missing = documented()
    .filter((entry) => !entry.package)
    .map((entry) => entry.url)
  assert.deepEqual(missing, [], 'Add `package` to the extension block of these pages')
})

test('presets only use documented features', () => {
  const names = new Set(documented().map((entry) => entry.name))
  for (const preset of EDITOR_PRESETS) {
    const unknown = [...preset.features, ...preset.suggestions].filter((name) => !names.has(name))
    assert.deepEqual(unknown, [], `preset ${preset.id}`)
  }
})

test('planEditor picks the smallest plan and lists add-ons, services and packages', () => {
  const byName = new Map(documented().map((entry) => [entry.name, entry]))
  const plan = (id) =>
    planEditor(
      EDITOR_PRESETS.find((preset) => preset.id === id).features.map((name) => byName.get(name)),
    )

  const simple = plan('simple')
  assert.equal(simple.plan, 'Open source')
  assert.equal(simple.hasProPackages, false)
  assert.deepEqual(simple.services, [])

  const word = plan('word')
  assert.equal(word.plan, 'Team')
  assert.ok(word.packages.includes('@tiptap-pro/extension-pages'))
  assert.ok(word.services.includes('tiptap-service'))
  // Open-source packages come first
  assert.ok(
    word.packages.indexOf('@tiptap/starter-kit') <
      word.packages.indexOf('@tiptap-pro/extension-pages'),
  )

  const review = plan('review')
  assert.deepEqual(review.addOns.sort(), ['Compare', 'Tracked Changes'])
  assert.ok(review.services.includes('document-server'))
  // The Document Server needs the provider and the Collaboration extension to connect
  assert.ok(review.packages.includes('@tiptap-pro/provider'))
  const comments = planEditor([byName.get('Comments')])
  assert.ok(comments.packages.includes('@tiptap-pro/provider'))
  assert.ok(comments.packages.includes('@tiptap/extension-collaboration'))

  assert.deepEqual(plan('templates').pilot.sort(), ['Content Protection', 'Slots', 'Variables'])
})

test('nextSteps sends open source to the docs, plans to the trial, and the rest to sales', () => {
  const byName = new Map(documented().map((entry) => [entry.name, entry]))
  const features = (id) =>
    EDITOR_PRESETS.find((preset) => preset.id === id).features.map((name) => byName.get(name))

  assert.equal(nextSteps(planEditor(features('simple'))).primary.label, 'Start building')
  assert.equal(nextSteps(planEditor(features('word'))).primary.label, 'Start free trial')
  assert.equal(nextSteps(planEditor(features('review'))).primary.label, 'Talk to sales')
  // An add-on you can buy in the dashboard leads to the trial, not to sales
  const trackedChanges = nextSteps(planEditor([byName.get('Tracked Changes')]))
  assert.equal(trackedChanges.primary.label, 'Start free trial')
  assert.match(trackedChanges.primary.text, /Tracked Changes/)
  const onPremises = planEditor(features('simple'), undefined, 'on-premises')
  assert.equal(nextSteps(onPremises).primary.label, 'Talk to sales')
})

test('plan_editor answers with plan, install command and docs', async () => {
  const { content } = await tool('plan_editor', { preset: 'review', features: ['Mention', 'Nope'] })
  const markdown = content[0].text
  assert.match(markdown, /# Editor plan: Review workflow/)
  assert.match(markdown, /- Add-ons: /)
  assert.match(markdown, /npm install .*@tiptap\/extension-mention/)
  assert.match(markdown, /Not in the catalog, so left out: Nope/)
  assert.match(markdown, /## Next step\n\n- Talk to sales/)

  const onPremises = await tool('plan_editor', { preset: 'simple', deployment: 'on-premises' })
  assert.match(onPremises.content[0].text, /- Plan: Enterprise/)

  const error = await tool('plan_editor', {})
  assert.equal(error.isError, true)
})

test('industries only name catalog features, and list_features filters by them', async () => {
  const names = new Set(getCatalog().map((entry) => entry.name))
  for (const industry of INDUSTRIES) {
    const unknown = industry.features.filter((name) => !names.has(name))
    assert.deepEqual(unknown, [], `industry ${industry.id}`)
  }

  const { content } = await tool('list_features', { industry: 'legal' })
  assert.match(content[0].text, /Tracked Changes/)
  assert.doesNotMatch(content[0].text, /- Bold /)
})

test('.md links keep their query after the .md, and the platform page lists plans', async () => {
  const md = await fileToMarkdown('src/content/platform.mdx')
  assert.match(md, /\/editor\/extensions\/overview\.md\?plan=Open%20source\)/)
  assert.match(md, /- \*\*Add-ons:\*\* .*\[Tracked Changes\]/)
  assert.match(md, /- \*\*Enterprise:\*\* /)
})

test('every legacy page names what replaces it, with links that reach a page', async () => {
  const pages = getDocsIndex()
  const legacy = pages.filter((page) => page.status === 'Legacy')
  assert.ok(legacy.length > 0)
  assert.deepEqual(
    legacy.filter((page) => !legacyFeature(page.route)).map((page) => page.route),
    [],
    'legacy pages without an entry in src/content/legacy.ts',
  )
  const routes = new Set(pages.map((page) => page.route))
  const hrefs = LEGACY_FEATURES.flatMap((feature) => [
    feature.replacedBy?.href,
    feature.migrate?.href,
    feature.note?.link.href,
  ]).filter((href) => href && href.startsWith('/'))
  assert.deepEqual(
    hrefs.filter((href) => !routes.has(href)),
    [],
  )

  const markdown = await fileToMarkdown('src/content/pages/getting-started/overview.mdx')
  assert.match(
    markdown,
    /> \*\*Legacy:\*\* Existing projects can keep using Pages\. Page Layout will replace it/,
  )
})
