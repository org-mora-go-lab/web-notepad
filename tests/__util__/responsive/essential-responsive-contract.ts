import { expect, type Page } from "@playwright/test";

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 640 },
  { width: 375, height: 667 },
  { width: 390, height: 844 },
  { width: 412, height: 915 },
  { width: 480, height: 800 },
  { width: 512, height: 844 },
  { width: 513, height: 844 },
  { width: 640, height: 900 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
] as const;
const themes = ["dark", "light", "system"] as const;
const fontScales = [0.8, 0.9, 1.1] as const;

export const essentialResponsiveCases = viewports.flatMap((viewport) =>
  themes.flatMap((theme) =>
    fontScales.map((fontScale) => ({ viewport, theme, fontScale })),
  ),
);

export async function expectEssentialResponsiveContract(
  page: Page,
  caseIndex: number,
) {
  const entry = essentialResponsiveCases[caseIndex];
  if (!entry) throw new Error(`Unknown responsive case: ${caseIndex}`);
  await page.setViewportSize(entry.viewport);
  await page.addInitScript(({ theme, fontScale }) => {
    if (theme === "system") localStorage.removeItem("web-notepad-theme");
    else localStorage.setItem("web-notepad-theme", theme);
    localStorage.setItem(
      "web-notepad-storage",
      JSON.stringify({ state: { settings: { fontScale } }, version: 0 }),
    );
  }, entry);
  await page.goto("/");

  await expect(page.locator("main.home")).toBeVisible();
  await expect(page.locator("textarea").first()).toBeVisible();
  await expect(page.locator(".footer")).toBeVisible();
  await expect(page.locator(".group-select-command")).toBeVisible();
  await expect(page.locator(".dashboard-command")).toBeVisible();
  await expect(
    page.locator(".footer .auth-command:not(.is-loading)"),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await expect
    .poll(() =>
      page.evaluate(() =>
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--font-scale",
          ),
        ),
      ),
    )
    .toBe(entry.fontScale);

  const footer = (await page.locator(".footer").boundingBox())!;
  expect(footer.x).toBeGreaterThanOrEqual(0);
  expect(footer.x + footer.width).toBeLessThanOrEqual(entry.viewport.width + 1);
  if (entry.viewport.width <= 512) {
    expect(footer.height).toBeCloseTo(81.8, 1);
    expect(footer.y + footer.height).toBeCloseTo(entry.viewport.height, 1);
  } else {
    expect(footer.height).toBeCloseTo(48, 1);
  }
}
