import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  // Local full-core parallelism was benchmarked; CLI --workers can override it.
  // The hosted runner has four cores and a ten-minute job budget. Using all
  // four keeps the complete E2E contract inside that budget without sharding
  // related scenarios across separate application servers.
  workers: process.env.CI ? 4 : "100%",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "line",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    env: {
      KAKAO_REST_API_KEY: "test-rest-key",
      KAKAO_REDIRECT_URI: "http://localhost:3000/api/auth/oauth/kakao/callback",
      AUTH_SECRET: "test-auth-secret",
      LOCAL_DEV_LOGIN: "0",
      TURSO_DATABASE_URL: "file:test-results/notepad-e2e.db",
    },
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
