import { expect, test } from '@playwright/test'
import { bySection, eachLimit, routes, siteUrl, toRoute } from './site'

// HTTP checks over every page and every published URL. No browser needed, so
// they cover the whole site in a few minutes.

const pages: string[] = routes.listPageRoutes()
const pageSet = new Set(pages)
const redirected: string[] = routes.readKnownUrls().filter((url: string) => !pageSet.has(url))

for (const [section, list] of bySection(pages)) {
  test(`pages in /${section} answer 200, also as .md`, async ({ request, baseURL }) => {
    test.setTimeout(30_000 + list.length * 2_000)
    const failures: string[] = []
    await eachLimit(list, 6, async (route) => {
      const html = await request.get(siteUrl(baseURL, route))
      if (html.status() !== 200) failures.push(`${route}: ${html.status()}`)
      const markdown = await request.get(
        siteUrl(baseURL, route === '/' ? '/index.md' : `${route}.md`),
      )
      if (markdown.status() !== 200) failures.push(`${route}.md: ${markdown.status()}`)
      else if (!markdown.headers()['content-type']?.includes('text/markdown')) {
        failures.push(`${route}.md: content-type ${markdown.headers()['content-type']}`)
      }
    })
    expect(failures).toEqual([])
  })
}

for (const [section, list] of bySection(redirected)) {
  test(`old URLs in /${section} redirect permanently to a live page`, async ({
    request,
    baseURL,
  }) => {
    test.setTimeout(30_000 + list.length * 2_000)
    const failures: string[] = []
    await eachLimit(list, 6, async (url) => {
      const expected = routes.matchRedirect(url)?.destination
      const response = await request.get(siteUrl(baseURL, url), { maxRedirects: 0 })
      const location = response.headers()['location']
      if (![301, 308].includes(response.status()) || !location) {
        failures.push(`${url}: ${response.status()}, expected a permanent redirect to ${expected}`)
        return
      }
      const target = toRoute(baseURL, location)
      if (routes.normalize(target) !== routes.normalize(expected ?? '')) {
        failures.push(`${url}: redirects to ${target}, redirects.mjs says ${expected}`)
        return
      }
      if (/^https?:\/\//.test(target)) return
      const final = await request.get(siteUrl(baseURL, target.split('#')[0]))
      if (final.status() !== 200) failures.push(`${url} → ${target}: ${final.status()}`)
    })
    expect(failures).toEqual([])
  })
}

test('a missing page answers 404', async ({ request, baseURL }) => {
  const response = await request.get(siteUrl(baseURL, '/editor/this-page-does-not-exist'))
  expect(response.status()).toBe(404)
})

test('llms.txt lists pages as Markdown links', async ({ request, baseURL }) => {
  const response = await request.get(siteUrl(baseURL, '/llms.txt'))
  expect(response.status()).toBe(200)
  expect(await response.text()).toContain('.md)')
})
