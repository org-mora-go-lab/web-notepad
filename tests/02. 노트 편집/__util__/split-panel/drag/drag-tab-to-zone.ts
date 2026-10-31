import { expect, type Locator, type Page } from "@playwright/test";

import { hoverTabOverPane, moveOverPane } from "./hover-tab-over-pane";

// Drags a tab over the pane and drops it on the drop zone labelled `zoneLabel`.
export async function dragTabToZone(
  page: Page,
  tab: Locator,
  pane: Locator,
  zoneLabel: string,
) {
  const release = await hoverTabOverPane(page, tab, pane, 0.25, 0.25);
  // The bottom split zone only appears below the middle of the editor.
  if (zoneLabel === "Split down") await moveOverPane(page, pane, 0.25, 0.75);
  const zone = pane.locator(".note-pane-drop", { hasText: zoneLabel });
  await expect(zone).toBeVisible();
  await zone.evaluate((element) => {
    const transfer = (
      window as typeof window & { __e2eTabTransfer?: DataTransfer }
    ).__e2eTabTransfer;
    element.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer: transfer,
      }),
    );
  });
  await release();
}
