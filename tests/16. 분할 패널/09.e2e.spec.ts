import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";
import { dragTabToZone, paneSlot } from "./__util__";

test("9. 좌우 열의 상단 패널을 Split down으로 상하 분할해 최대 4분할까지 확장한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("a");
  for (const content of ["b", "c", "d"]) {
    await addTabButton(page).click();
    await page.locator("textarea").fill(content);
  }
  const tab = (text: string) => page.locator(".tab-item").filter({ hasText: new RegExp(`^${text}$`) });

  // Split down stays hidden until the tab passes the middle of the editor.
  const tabBox = (await tab("d").boundingBox())!;
  const bodyBox = (await paneSlot(page, "left").locator(".body").boundingBox())!;
  const splitDown = paneSlot(page, "left").locator(".note-pane-drop", { hasText: "Split down" });
  await page.mouse.move(tabBox.x + tabBox.width / 2, tabBox.y + tabBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(bodyBox.x + bodyBox.width / 4, bodyBox.y + bodyBox.height * 0.4, { steps: 5 });
  await expect(paneSlot(page, "left").locator(".note-pane-drop", { hasText: "Split right" })).toBeVisible();
  await expect(splitDown).toHaveCount(0);
  await page.mouse.move(bodyBox.x + bodyBox.width / 4, bodyBox.y + bodyBox.height * 0.6, { steps: 5 });
  await expect(splitDown).toBeVisible();
  await page.mouse.move(bodyBox.x + bodyBox.width / 4, bodyBox.y + bodyBox.height * 0.4, { steps: 5 });
  await expect(splitDown).toHaveCount(0);
  await page.mouse.move(tabBox.x + tabBox.width / 2, tabBox.y + tabBox.height / 2, { steps: 5 });
  await page.mouse.up();

  await dragTabToZone(page, tab("d"), paneSlot(page, "left"), "Split down");
  await expect(page.locator(".pane-slot")).toHaveCount(2);
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue("d");

  await dragTabToZone(page, tab("c"), paneSlot(page, "left"), "Split right");
  await expect(paneSlot(page, "right").locator("textarea")).toHaveValue("c");

  await dragTabToZone(page, tab("b"), paneSlot(page, "right"), "Split down");
  await expect(page.locator(".pane-slot")).toHaveCount(4);
  await expect(paneSlot(page, "left").locator("textarea")).toHaveValue("a");
  await expect(paneSlot(page, "right-bottom").locator("textarea")).toHaveValue("b");

  const [leftTop, leftBottom, rightTop, rightBottom] = await Promise.all(
    ["left", "left-bottom", "right", "right-bottom"].map(
      async (pane) => (await paneSlot(page, pane).boundingBox())!,
    ),
  );
  expect(leftBottom.y).toBeGreaterThanOrEqual(leftTop.y + leftTop.height);
  expect(rightBottom.y).toBeGreaterThanOrEqual(rightTop.y + rightTop.height);
  expect(rightTop.x).toBeGreaterThanOrEqual(leftTop.x + leftTop.width);
  expect(leftBottom.x).toBeCloseTo(leftTop.x, 0);
  expect(rightBottom.x).toBeCloseTo(rightTop.x, 0);

  // With four panes open there is nowhere left to split.
  const firstTabBox = (await tab("a").boundingBox())!;
  const targetBox = (await paneSlot(page, "right-bottom").locator(".body").boundingBox())!;
  await page.mouse.move(firstTabBox.x + firstTabBox.width / 2, firstTabBox.y + firstTabBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height * 0.75, { steps: 5 });
  await expect(paneSlot(page, "right-bottom").locator(".note-pane-drop")).toHaveText(["Move here"]);
  await page.mouse.move(firstTabBox.x + firstTabBox.width / 2, firstTabBox.y + firstTabBox.height / 2, { steps: 5 });
  await page.mouse.up();
  await expect(page.locator(".pane-slot")).toHaveCount(4);
});
