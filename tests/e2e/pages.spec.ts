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
  await expect(page.locator('[data-breadcrumb]')).toHaveText(['Editor', 'Extensions', 'Marks'])
})

test('a folded sidebar category opens on click', async ({ page, baseURL }) => {
  await page.goto(siteUrl(baseURL, '/'))
  const category = page.getByRole('button', { name: 'Document Platform' })
  await expect(category).toHaveAttribute('aria-expanded', 'false')
  await category.click()
  await expect(category).toHaveAttribute('aria-expanded', 'true')
  // The entry's name includes its fold button: "Comments Expand Comments"
  await expect(
    page
      .locator('nav')
      .getByRole('link', { name: /^Comments\b/ })
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
