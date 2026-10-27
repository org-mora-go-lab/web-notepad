import type { Page } from "@playwright/test";

// Drags the open panel's left-edge handle to the viewport x position.
export async function dragPanelEdgeTo(page: Page, panelId: string, x: number) {
  const handle = page.locator(`#${panelId} .side-panel-resizer`);
  const bounds = (await handle.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(x, bounds.y + bounds.height / 2, { steps: 5 });
  await page.mouse.up();
}
