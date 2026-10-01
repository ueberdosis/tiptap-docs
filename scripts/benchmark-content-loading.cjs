const assert = require('node:assert/strict')
const { fork } = require('node:child_process')
const path = require('node:path')
const { setTimeout: delay } = require('node:timers/promises')

const port = Number(process.env.DOCS_BENCH_PORT || 3146)
const root = path.resolve('.next/standalone')
const child = fork(path.join(root, 'server.js'), [], {
  cwd: root,
  env: { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1' },
  execArgv: ['--expose-gc', '--require', path.resolve('tests/helpers/content-memory-probe.cjs')],
  stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
})
let log = ''
child.stdout.on('data', (chunk) => {
  log += chunk
})
child.stderr.on('data', (chunk) => {
  log += chunk
})
const base = `http://127.0.0.1:${port}`
const routes = [
  '/',
  '/editor/extensions/overview',
  '/editor/extensions/nodes',
  '/ui-components/components/overview',
  '/resources/incidents/06-25-2025-link-popover',
]

function snapshot() {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Memory snapshot timed out')), 5000)
    child.once('message', (value) => {
      clearTimeout(timeout)
      resolve(value)
    })
    child.send('snapshot')
  })
}

async function request(route) {
  const response = await fetch(`${base}${route}`)
  assert.equal(response.status, 200, route)
  const html = await response.text()
  assert.ok(!html.includes('allMeta'), `Whole metadata tree sent for ${route}`)
  return Buffer.byteLength(html)
}

async function main() {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await request('/')
      ready = true
      break
    } catch {
      await delay(100)
    }
  }
  if (!ready) throw new Error(`Standalone server did not start:\n${log}`)
  for (const route of routes) await request(route)
  const before = await snapshot()
  const samples = []
  for (let wave = 0; wave < 20; wave++) {
    const started = performance.now()
    let bytes = 0
    for (let batch = 0; batch < 5; batch++) {
      const responses = await Promise.all(routes.map(request))
      bytes += responses.reduce((total, size) => total + size, 0)
    }
    samples.push({
      requests: (wave + 1) * 25,
      elapsedMs: Math.round(performance.now() - started),
      averageHtmlBytes: Math.round(bytes / 25),
      ...(await snapshot()),
    })
  }
  const heapGrowth = samples.at(-1).memory.heapUsed - samples[0].memory.heapUsed
  assert.ok(heapGrowth < 16 * 1024 * 1024, `Retained heap grew by ${heapGrowth} bytes`)
  // A plain page should load its compiled module, with no raw MDX scans for the footer.
  const plainBefore = await snapshot()
  for (let n = 0; n < 20; n++) await request('/resources/incidents/06-25-2025-link-popover')
  const plainAfter = await snapshot()
  assert.equal(plainAfter.mdxFiles, plainBefore.mdxFiles, 'Plain pages read raw MDX files')
  console.log(
    JSON.stringify(
      { before, samples, plainPageRawReads: plainAfter.mdxFiles - plainBefore.mdxFiles },
      null,
      2,
    ),
  )
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => child.kill())
