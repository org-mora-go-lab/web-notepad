import type { Locator, Page } from "@playwright/test";

// Starts dragging a tab and holds it over the pane editor at the given relative position.
// Returns a function that moves the tab back to where it started and releases it.
export async function hoverTabOverPane(
  page: Page,
  tab: Locator,
  pane: Locator,
  xRatio: number,
  yRatio: number,
) {
  const tabBox = (await tab.boundingBox())!;
  const start = {
    x: tabBox.x + tabBox.width / 2,
    y: tabBox.y + tabBox.height / 2,
  };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  // Enter the editor in its upper part first so later moves register as drag-over updates.
  await moveOverPane(page, pane, xRatio, 0.25);
  await moveOverPane(page, pane, xRatio, yRatio);
  return async () => {
    await page.mouse.move(start.x, start.y, { steps: 5 });
    await page.mouse.up();
  };
}

// Moves the held pointer over the pane editor at the given relative position.
export async function moveOverPane(
  page: Page,
  pane: Locator,
  xRatio: number,
  yRatio: number,
) {
  const bodyBox = (await pane.locator(".body").boundingBox())!;
  await page.mouse.move(
    bodyBox.x + bodyBox.width * xRatio,
    bodyBox.y + bodyBox.height * yRatio,
    { steps: 5 },
  );
}
