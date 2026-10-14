import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, hoverTabOverPane, paneSlot } from "../__util__";

test("4. Move here는 표시 중인 분할 영역과 겹치지 않는 나머지 영역을 사용한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("a");
  for (const content of ["b", "c"]) {
    await addTabButton(page).click();
    await page.locator("textarea").fill(content);
  }
  const tab = (text: string) => page.locator(".tab-item").filter({ hasText: new RegExp(`^${text}$`) });
  await dragTabToZone(page, tab("c"), paneSlot(page, "left"), "Split right");
  const right = paneSlot(page, "right");
  const bodyBox = (await right.locator(".body").boundingBox())!;
  const release = await hoverTabOverPane(page, tab("b"), right, 0.25, 0.75);
  const moveBox = (await right.locator(".note-pane-drop", { hasText: "Move here" }).boundingBox())!;
  const downBox = (await right.locator(".note-pane-drop", { hasText: "Split down" }).boundingBox())!;
  expect(moveBox.y).toBeCloseTo(bodyBox.y, 0);
  expect(moveBox.width).toBeCloseTo(bodyBox.width, 0);
  expect(moveBox.y + moveBox.height).toBeLessThanOrEqual(downBox.y + 1);
  await release();
});
