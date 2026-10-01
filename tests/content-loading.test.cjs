const assert = require('node:assert/strict')
const fs = require('node:fs')
const fsp = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
})

// Use Next's server React, which supplies cache() for Server Components.
require('react')
require.cache[
  require.resolve('react')
].exports = require('next/dist/compiled/react/react.react-server')

const frontmatter = require('front-matter')
const { getExtensions } = require('../src/server/getExtensions.ts')
const { getUIComponents } = require('../src/server/getUIComponents.ts')

async function withCatalog(files, run) {
  const cwd = process.cwd()
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'docs-content-')))
  const catalog = path.join(root, 'src/content/catalog')
  fs.mkdirSync(catalog, { recursive: true })
  for (const [name, content] of Object.entries(files)) {
    fs.writeFileSync(path.join(catalog, name), content)
  }
  process.chdir(root)
  try {
    await run(catalog)
  } finally {
    process.chdir(cwd)
    fs.rmSync(root, { recursive: true, force: true })
  }
}

async function measureReads(catalog, run) {
  let bytes = 0
  const readFileSync = fs.readFileSync
  const open = fsp.open
  fs.readFileSync = function (file, ...args) {
    const result = readFileSync.call(this, file, ...args)
    if (String(file).startsWith(catalog)) bytes += Buffer.byteLength(result)
    return result
  }
  fsp.open = async function (file, ...args) {
    const handle = await open.call(this, file, ...args)
    if (String(file).startsWith(catalog)) {
      const read = handle.read.bind(handle)
      handle.read = async (...readArgs) => {
        const result = await read(...readArgs)
        bytes += result.bytesRead
        return result
      }
    }
    return handle
  }
  try {
    const result = await run()
    return { result, bytes }
  } finally {
    fs.readFileSync = readFileSync
    fsp.open = open
  }
}

const largeBody = `\nimport Broken from "missing-module"\n${'body '.repeat(800_000)}`

test('extension cards preserve links and tags without reading MDX bodies', async () => {
  await withCatalog(
    {
      'sample.mdx': `---
extension:
  name: Sample
  type: extension
  description: Example
  tags: [Existing]
tags:
  - type: beta
  - type: start
  - type: team
  - type: addon
---\n${largeBody}`,
      'overview.mdx': 'invalid: yaml: excluded',
      'index.mdx': 'invalid: yaml: excluded',
    },
    async (catalog) => {
      const { result, bytes } = await measureReads(catalog, () => getExtensions('content/catalog'))
      assert.deepEqual(Object.values(result), [
        {
          name: 'Sample',
          type: 'extension',
          description: 'Example',
          tags: ['Existing', 'Start', 'Team', 'Addon'],
          isNew: true,
          path: 'sample.mdx',
          url: '/catalog/sample',
        },
      ])
      assert.ok(bytes < 16_384, `Read ${bytes} bytes for one small header`)
    },
  )
})

test('UI cards preserve case-insensitive order and flags without reading MDX bodies', async () => {
  await withCatalog(
    {
      'zebra.mdx': `---\ncomponent:\n  name: Zebra\n  type: primitive\n  isNew: true\n  isOpen: false\n---\n${largeBody}`,
      'alpha.mdx':
        '---\ncomponent:\n  name: alpha\n  type: component\n  isNew: false\n  isOpen: true\n---\nBody',
      'plain.mdx': '---\ntitle: Plain\n---\nBody',
    },
    async (catalog) => {
      const { result, bytes } = await measureReads(catalog, () =>
        getUIComponents('content/catalog'),
      )
      assert.deepEqual(Object.values(result), [
        {
          name: 'alpha',
          type: 'component',
          isNew: false,
          isOpen: true,
          path: 'alpha.mdx',
          url: '/catalog/alpha',
        },
        {
          name: 'Zebra',
          type: 'primitive',
          isNew: true,
          isOpen: false,
          path: 'zebra.mdx',
          url: '/catalog/zebra',
        },
      ])
      assert.ok(bytes < 16_384, `Read ${bytes} bytes for three small headers`)
    },
  )
})

const { readFrontmatter } = require('../src/server/readFrontmatter.ts')

test('header reader matches YAML parsing across chunk and UTF-8 boundaries', async () => {
  const files = {
    'crlf.mdx': '\ufeff---\r\ntitle: Grüß dich\r\n---\r\nBody',
    'long.mdx': `---\ntitle: ${'ä'.repeat(6000)}\n...\nBody`,
    'yaml.mdx': '= yaml =\ntitle: Alternative\n= yaml =\nBody',
    'none.mdx': '# Plain MDX\nBody',
    'unfinished.mdx': '---\ntitle: No closing delimiter',
    'eof.mdx': '---\ntitle: No body\n---',
    'empty.mdx': '---\n---\nBody',
    'split.mdx': `---\ntitle: Chunk\n${' '.repeat(4096 - Buffer.byteLength('---\ntitle: Chunk\n') - 4)}\n---not-a-delimiter: ok\n---\nBody`,
  }
  await withCatalog(files, async (catalog) => {
    for (const [name, content] of Object.entries(files)) {
      assert.deepEqual(
        await readFrontmatter(path.join(catalog, name)),
        frontmatter(content).attributes,
        name,
      )
    }
  })
})

test('a closing delimiter at EOF is accepted exactly at the header limit', async () => {
  const prefix = '---\ntitle: Boundary\n#'
  const ending = '\n---'
  const content = `${prefix}${'x'.repeat(65_536 - Buffer.byteLength(prefix + ending))}${ending}`
  assert.equal(Buffer.byteLength(content), 65_536)

  await withCatalog({ 'boundary.mdx': content }, async (catalog) => {
    const { result, bytes } = await measureReads(catalog, () =>
      readFrontmatter(path.join(catalog, 'boundary.mdx')),
    )
    assert.deepEqual(result, { title: 'Boundary' })
    assert.equal(bytes, 65_536)
  })
})

test('a delimiter prefix at the limit is rejected when the file continues', async () => {
  const prefix = '---\ntitle: Boundary\n#'
  const ending = '\n---'
  const content = `${prefix}${'x'.repeat(65_536 - Buffer.byteLength(prefix + ending))}${ending}not-a-delimiter: value\n---`

  await withCatalog({ 'continued.mdx': content }, async (catalog) => {
    const { bytes } = await measureReads(catalog, () =>
      assert.rejects(readFrontmatter(path.join(catalog, 'continued.mdx')), /exceeds 64 KiB/),
    )
    assert.equal(bytes, 65_536)
  })
})

test('header reader releases file handles when YAML parsing fails', async () => {
  await withCatalog({ 'bad.mdx': '---\ntitle: [unterminated\n---\nBody' }, async (catalog) => {
    const open = fsp.open
    let closed = false
    fsp.open = async (...args) => {
      const handle = await open(...args)
      const close = handle.close.bind(handle)
      handle.close = async () => {
        closed = true
        await close()
      }
      return handle
    }
    try {
      await assert.rejects(readFrontmatter(path.join(catalog, 'bad.mdx')))
      assert.equal(closed, true)
    } finally {
      fsp.open = open
    }
  })
})

test('an unterminated header cannot read an arbitrarily large MDX body', async () => {
  await withCatalog({ 'unclosed.mdx': `---\ntitle: Broken\n${largeBody}` }, async (catalog) => {
    const { result, bytes } = await measureReads(catalog, async () => {
      try {
        await readFrontmatter(path.join(catalog, 'unclosed.mdx'))
        return 'accepted'
      } catch (error) {
        return error.message
      }
    })
    assert.match(result, /frontmatter.*64 KiB/i)
    assert.ok(bytes <= 65_536, `Unclosed header read ${bytes} bytes`)
  })
})

test('header-only reads match every checked-in MDX header', async () => {
  const glob = require('fast-glob')
  for (const file of await glob('src/content/**/*.mdx')) {
    const expected = frontmatter(fs.readFileSync(file, 'utf8')).attributes
    assert.deepEqual(await readFrontmatter(file), expected, file)
  }
})

const { getIncidents } = require('../src/server/getIncidents.ts')

test('incident lists preserve date order and defaults without reading bodies', async () => {
  await withCatalog({}, async () => {
    const incidents = path.join(process.cwd(), 'src/content/resources/incidents')
    fs.mkdirSync(incidents, { recursive: true })
    fs.writeFileSync(
      path.join(incidents, 'older.mdx'),
      `---\ntitle: Older\nincident:\n  date: '2024-01-01'\n  product: Editor\n  status: resolved\n  severity: low\n---\n${largeBody}`,
    )
    fs.writeFileSync(
      path.join(incidents, 'newer.mdx'),
      `---\ntitle: Newer\nincident:\n  date: '2025-01-01'\n  product: Editor\n  status: resolved\n  severity: low\n---\n${largeBody}`,
    )
    fs.writeFileSync(path.join(incidents, 'unknown.mdx'), '---\ntitle: Unknown\n---\nBody')
    const { result, bytes } = await measureReads(incidents, getIncidents)
    assert.deepEqual(
      result.map((incident) => incident.title),
      ['Newer', 'Older', 'Unknown'],
    )
    assert.equal(result[0].url, '/resources/incidents/newer')
    assert.deepEqual(result[2].incident, {
      product: '',
      date: '',
      status: 'resolved',
      severity: 'low',
    })
    assert.deepEqual(result[2].meta, { title: '', description: '', category: '' })
    assert.ok(bytes < 16_384, `Incident headers read ${bytes} bytes`)
  })
})
