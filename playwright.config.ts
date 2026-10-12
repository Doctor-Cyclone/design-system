import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 2,
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/browser-results.json' }],
  ],
  snapshotPathTemplate:
    '{testDir}/screenshots/{platform}/{projectName}/{testFilePath}/{arg}{ext}',
  expect: {
    timeout: 5000,
    toHaveScreenshot: { animations: 'disabled', maxDiffPixelRatio: 0.005 },
  },
  use: {
    baseURL: 'http://127.0.0.1:6006',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 960, height: 720 },
      },
    },
  ],
  webServer: {
    command:
      'pnpm exec vite preview --outDir storybook-static --host 127.0.0.1 --port 6006 --strictPort',
    url: 'http://127.0.0.1:6006/iframe.html',
    reuseExistingServer: false,
    timeout: 30000,
  },
});
