import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  timeout: 30000,
  retries: 0,
  reporter: [["list"], ["html", { outputFolder: "tests/visual/report", open: "never" }]],
  use: {
    baseURL: "http://localhost:3001",
    screenshot: "only-on-failure",
    video: "off",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
