import { defineConfig, devices } from '@playwright/test'

// DOCS_TEST_URL is the site root including any base path, e.g.
// https://tiptap-docs-git-my-branch-tiptap.vercel.app or https://tiptap.dev/docs.
// Without it, the tests start `next start` on a local build (`pnpm build:next` first).
const externalUrl = process.env.DOCS_TEST_URL
const localUrl = 'http://127.0.0.1:3145'
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: externalUrl ?? localUrl,
    // Protected Vercel previews let automation in with this header.
    extraHTTPHeaders: bypassSecret
      ? { 'x-vercel-protection-bypass': bypassSecret, 'x-vercel-set-bypass-cookie': 'true' }
      : undefined,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, grepInvert: /@mobile/ },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, grep: /@mobile/ },
  ],
  webServer: externalUrl
    ? undefined
    : {
        command: 'pnpm exec next start -p 3145 -H 127.0.0.1',
        url: `${localUrl}/editor/getting-started/overview`,
        reuseExistingServer: true,
        timeout: 120_000,
      },
})
