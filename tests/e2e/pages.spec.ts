import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { routes, siteRoot, siteUrl } from './site'

// Browser checks on one page per page type. Add a page here when a new type
// of page appears; SMOKE_ALL=1 runs the error check over every page instead.

const PAGE_TYPES: Record<string, string> = {
  home: '/',
  'section overview': '/editor/getting-started/overview',
  install: '/editor/getting-started/install/react',
  'extension catalog': '/editor/extensions/overview',
  'extension page': '/editor/extensions/marks/bold',
  'pro product page': '/comments/getting-started/overview',
  'api reference': '/editor/api/commands/content/set-content',
  guide: '/guides/accessibility',
  example: '/examples/basics/default-text-editor',
  'ui component': '/ui-components/components/mark-button',
  changelog: '/resources/changelog',
  configurator: '/configurator',
}

/** Collects uncaught errors and console errors from the docs origin, not from demo iframes. */
function watchErrors(page: Page, origin: string) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
  page.on('console', (message) => {
    if (message.type() !== 'error') return
    const source = message.location().url
    if (source && !source.startsWith(origin)) return
    errors.push(`console: ${message.text()}`)
  })
  return errors
}

for (const [type, route] of Object.entries(PAGE_TYPES)) {
  test.describe(`${type} (${route})`, () => {
    test('renders without errors and marks its sidebar entry', async ({ page, baseURL }) => {
      const errors = watchErrors(page, new URL(siteRoot(baseURL)).origin)
      const response = await page.goto(siteUrl(baseURL, route))
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1').first()).toBeVisible()
      await expect(page.locator('nav [aria-current="page"]').first()).toBeAttached()
      await page.waitForLoadState('networkidle')
      expect(errors).toEqual([])
    })

    test('has no serious accessibility violations', async ({ page, baseURL }) => {
      await page.goto(siteUrl(baseURL, route))
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        // Demos are other apps in iframes; they get their own checks.
        .exclude('iframe')
        .analyze()
      const serious = results.violations
        .filter((violation) => violation.impact === 'serious' || violation.impact === 'critical')
        .map((violation) => `${violation.id} (${violation.nodes.length}×): ${violation.help}`)
      expect(serious).toEqual([])
    })
  })
}

test('breadcrumbs follow the page’s place in the sidebar', async ({ page, baseURL }) => {
  await page.goto(siteUrl(baseURL, PAGE_TYPES['extension page']))
  await expect(page.locator('[data-breadcrumb]')).toHaveText(['Features', 'Text formatting'])
})

test('the feature catalog filters by plan and status, from the URL and on click', async ({
  page,
  baseURL,
}) => {
  const errors = watchErrors(page, new URL(siteRoot(baseURL)).origin)
  await page.goto(siteUrl(baseURL, '/editor/extensions/overview?plan=Add-on'))
  const cards = page.locator('section[aria-label] a')
  await expect(cards.first()).toBeVisible()
  for (const card of await cards.all()) await expect(card).toContainText('Add-on')

  // Several plans at once, picked in a dropdown that stays open
  await page.getByRole('button', { name: 'Plan: Add-on' }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Team' }).click()
  await expect(page).toHaveURL(/[?&]plan=Add-on,Team/)
  await page.getByRole('menuitemcheckbox', { name: 'Add-on' }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Team' }).click()
  await page.keyboard.press('Escape')
  await expect(page).not.toHaveURL(/plan=/)

  await page.getByRole('button', { name: 'Status', exact: true }).click()
  await page.getByRole('menuitemcheckbox', { name: 'Legacy' }).click()
  await page.keyboard.press('Escape')
  await expect(page).toHaveURL(/[?&]status=Legacy/)
  const catalog = page.locator('section[aria-label]')
  await expect(catalog.getByRole('link', { name: /^Pages/ })).toBeVisible()
  await expect(catalog.getByRole('link', { name: /^Paragraph/ })).toHaveCount(0)

  await page.getByRole('button', { name: 'Reset', exact: true }).click()
  await expect(page).not.toHaveURL(/status=/)
  await expect(catalog.getByRole('link', { name: /^Paragraph/ })).toBeVisible()
  // Rendering with filters from the URL must not break hydration
  expect(errors).toEqual([])
})

test('the catalog filters by industry and the configurator adds its features', async ({
  page,
  baseURL,
}) => {
  await page.goto(siteUrl(baseURL, '/editor/extensions/overview?industry=legal'))
  const catalog = page.locator('section[aria-label]')
  await expect(catalog.getByRole('link', { name: /^Tracked Changes/ })).toBeVisible()
  await expect(catalog.getByRole('link', { name: /^Bold/ })).toHaveCount(0)

  await page.goto(siteUrl(baseURL, '/configurator?industry=finance'))
  await page.getByRole('button', { name: 'Add all for Finance' }).click()
  await expect(page.getByRole('complementary', { name: 'Your plan' })).toContainText('Team')
})

test('Plan your editor follows the preset, the features and where it runs', async ({
  page,
  baseURL,
}) => {
  const errors = watchErrors(page, new URL(siteRoot(baseURL)).origin)
  await page.goto(siteUrl(baseURL, '/configurator?preset=word'))
  const summary = page.getByRole('complementary', { name: 'Your plan' })
  await expect(summary).toContainText('Team')
  await expect(summary.getByRole('link', { name: 'Start free trial' })).toBeVisible()
  await expect(summary.locator('pre')).toContainText('@tiptap-pro/extension-pages')

  await page.getByRole('button', { name: /^Simple editor/ }).click()
  // The default preset leaves the URL clean
  await expect(page).not.toHaveURL(/preset=/)
  await expect(summary).toContainText('Open source')
  await expect(summary.getByRole('link', { name: 'Start building' })).toBeVisible()
  await expect(summary.locator('pre')).not.toContainText('@tiptap-pro')

  await page.getByText(/^Browse all \d+ features$/).click()
  await page.getByRole('checkbox', { name: /^Comments/ }).check()
  await expect(summary).toContainText('Document Server')
  await expect(summary.locator('pre')).toContainText('@tiptap-pro/extension-comments')

  await page.getByRole('button', { name: 'Remove Comments' }).click()
  await expect(summary.locator('pre')).not.toContainText('@tiptap-pro/extension-comments')

  await page.getByRole('button', { name: /^On-premises/ }).click()
  await expect(page).toHaveURL(/hosting=on-premises/)
  await expect(summary).toContainText('Enterprise')
  await expect(summary.getByRole('link', { name: 'Talk to sales' })).toBeVisible()
  expect(errors).toEqual([])
})

test('a folded sidebar category opens on click', async ({ page, baseURL }) => {
  await page.goto(siteUrl(baseURL, '/'))
  const category = page.getByRole('button', { name: 'Documents', exact: true })
  await expect(category).toHaveAttribute('aria-expanded', 'false')
  await category.click()
  await expect(category).toHaveAttribute('aria-expanded', 'true')
  // An entry's name can include its plan tag, such as "Snapshots Start"
  await expect(
    page
      .locator('nav')
      .getByRole('link', { name: /^Snapshots\b/ })
      .first(),
  ).toBeVisible()
})

test('the header switches between the documentation and UI Components', async ({
  page,
  baseURL,
}) => {
  await page.goto(siteUrl(baseURL, PAGE_TYPES['ui component']))
  const header = page.locator('header nav')
  await expect(header.getByRole('link', { name: 'UI Components' })).toHaveAttribute(
    'aria-current',
    'true',
  )
  await header.getByRole('link', { name: 'Documentation' }).click()
  await expect(page).toHaveURL(siteUrl(baseURL, '/'))
})

test('the mobile navigation opens on the current page @mobile', async ({ page, baseURL }) => {
  await page.goto(siteUrl(baseURL, PAGE_TYPES['extension page']))
  const button = page.getByRole('button', { name: 'Bold', exact: true })
  await expect(button).toBeVisible()
  await button.click()
  await expect(page.locator('[aria-current="page"]:visible').first()).toBeVisible()
})

test('Plan your editor keeps the plan in a bar until the summary is reached @mobile', async ({
  page,
  baseURL,
}) => {
  await page.goto(siteUrl(baseURL, '/configurator?preset=review'))
  const bar = page.locator('a[href="#your-plan"]')
  await expect(bar).toBeInViewport()
  await expect(bar).toContainText('Start + add-ons')

  await page.getByRole('complementary', { name: 'Your plan' }).scrollIntoViewIfNeeded()
  await expect(bar).not.toBeInViewport()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(bar).not.toBeInViewport()
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(bar).toBeInViewport()
})

test.describe('every page in the browser', () => {
  test.skip(!process.env.SMOKE_ALL, 'Set SMOKE_ALL=1 to load every page in a browser')

  for (const route of routes.listPageRoutes() as string[]) {
    test(`${route} renders without errors`, async ({ page, baseURL }) => {
      const errors = watchErrors(page, new URL(siteRoot(baseURL)).origin)
      const response = await page.goto(siteUrl(baseURL, route))
      expect(response?.status()).toBe(200)
      await expect(page.locator('h1').first()).toBeVisible()
      expect(errors).toEqual([])
    })
  }
})
