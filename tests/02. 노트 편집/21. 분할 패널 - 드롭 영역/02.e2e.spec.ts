import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, hoverTabOverPane, paneSlot } from "../__util__";

test("2. 우하단이 비어 있으면 좌하단 패널에도 Split right를 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("a");
  for (const content of ["b", "c"]) {
    await addTabButton(page).click();
    await page.locator("textarea").fill(content);
  }
  const tab = (text: string) => page.locator(".tab-item").filter({ hasText: new RegExp(`^${text}$`) });
  const left = paneSlot(page, "left");
  await dragTabToZone(page, tab("c"), left, "Split right");
  await dragTabToZone(page, tab("b"), left, "Split down");
  const lowerLeft = paneSlot(page, "left-bottom");
  await lowerLeft.getByRole("button", { name: "New tab" }).click();
  await lowerLeft.locator("textarea").fill("e");

  const release = await hoverTabOverPane(page, tab("e"), lowerLeft, 0.25, 0.4);
  const zone = lowerLeft.locator(".note-pane-drop", { hasText: "Split right" });
  await expect(zone).toBeVisible();
  const bodyBox = (await lowerLeft.locator(".body").boundingBox())!;
  const zoneBox = (await zone.boundingBox())!;
  expect(zoneBox.x).toBeCloseTo(bodyBox.x + bodyBox.width / 2, 0);
  expect(zoneBox.height).toBeCloseTo(bodyBox.height, 0);
  await release();
});
