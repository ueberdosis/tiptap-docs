// The docs MCP server and llms.txt, without a running site.
// Run with `pnpm test:structure`.

const assert = require('node:assert/strict')
const { test } = require('node:test')

const routes = require('./helpers/routes.cjs')

// The site's TypeScript needs ts-node and the `@/` alias, so load it after registering them
routes.registerTs()
const { handleMcpMessage, toRoute } = loadSite('../src/server/mcp.ts')
const { buildLlmsTxt, markdownUrl } = loadSite('../src/server/llmsText.ts')
const { getDocsIndex } = loadSite('../src/server/getDocsIndex.ts')
const { fileToMarkdown } = loadSite('../src/server/markdown/fileToMarkdown.ts')
const { getCatalog } = loadSite('../src/server/getCatalog.ts')
const { EDITOR_PRESETS } = loadSite('../src/content/presets.ts')
const { planEditor } = loadSite('../src/utils/planEditor.ts')

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

test('every documented feature names its npm package', () => {
  const missing = documented()
    .filter((entry) => !entry.package)
    .map((entry) => entry.url)
  assert.deepEqual(missing, [], 'Add `package` to the extension block of these pages')
})

test('presets only use documented features', () => {
  const names = new Set(documented().map((entry) => entry.name))
  for (const preset of EDITOR_PRESETS) {
    const unknown = preset.features.filter((name) => !names.has(name))
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

  assert.deepEqual(plan('templates').pilot.sort(), ['Content Protection', 'Slots', 'Variables'])
})

test('plan_editor answers with plan, install command and docs', async () => {
  const { content } = await tool('plan_editor', { preset: 'review', features: ['Mention', 'Nope'] })
  const markdown = content[0].text
  assert.match(markdown, /# Editor plan: Review workflow/)
  assert.match(markdown, /- Add-ons: /)
  assert.match(markdown, /npm install .*@tiptap\/extension-mention/)
  assert.match(markdown, /Not in the catalog, so left out: Nope/)

  const error = await tool('plan_editor', {})
  assert.equal(error.isError, true)
})
