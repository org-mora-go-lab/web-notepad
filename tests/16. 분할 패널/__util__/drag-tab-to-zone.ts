import { expect, type Locator, type Page } from "@playwright/test";

// Drags a tab over the pane and drops it on the drop zone labelled `zoneLabel`.
export async function dragTabToZone(page: Page, tab: Locator, pane: Locator, zoneLabel: string) {
  const tabBox = (await tab.boundingBox())!;
  const bodyBox = (await pane.locator(".body").boundingBox())!;
  await page.mouse.move(tabBox.x + tabBox.width / 2, tabBox.y + tabBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(bodyBox.x + bodyBox.width / 4, bodyBox.y + bodyBox.height / 4, { steps: 5 });
  const zone = pane.locator(".note-pane-drop", { hasText: zoneLabel });
  await expect(zone).toBeVisible();
  const zoneBox = (await zone.boundingBox())!;
  await page.mouse.move(zoneBox.x + zoneBox.width / 2, zoneBox.y + zoneBox.height / 2, { steps: 5 });
  await page.mouse.up();
}
