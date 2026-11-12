const assert = require('node:assert/strict')
const { test } = require('node:test')

const base = process.env.DOCS_TEST_URL || 'http://127.0.0.1:3145'

test('pages send only the current edit path, including homepage and index routes', async () => {
  for (const [route, file] of [
    ['/', 'index.mdx'],
    ['/editor/extensions/overview', 'editor/extensions/overview.mdx'],
    ['/editor/extensions/nodes', 'editor/extensions/nodes/index.mdx'],
    ['/ui-components/components/overview', 'ui-components/components/overview.mdx'],
  ]) {
    const response = await fetch(`${base}${route}`)
    assert.equal(response.status, 200, route)
    const html = await response.text()
    assert.ok(!html.includes('github.com/undefined'), `Broken edit URL for ${route}`)
    assert.ok(html.includes(`/content/${file}`), `Missing edit link for ${route}`)
    assert.ok(!html.includes('allMeta'), `Whole metadata tree sent for ${route}`)
    assert.ok(html.includes('<title>'), `Missing page metadata for ${route}`)
  }
})

test('missing pages stay 404 and have no edit link', async () => {
  const response = await fetch(`${base}/editor/not-a-real-page-pr-592`)
  assert.equal(response.status, 404)
  const html = await response.text()
  assert.ok(!html.includes('Edit this page on GitHub'))
  assert.ok(!html.includes('allMeta'))
})

test('markdown responses still work after the rebase', async () => {
  const response = await fetch(`${base}/editor/extensions/overview.md`)
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type'), /text\/markdown/)
  assert.match(await response.text(), /extensions/i)
})
