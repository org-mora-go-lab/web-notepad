import { expect, test } from "@playwright/test";

import { addTabButton } from "../__util__";
import { dragTabToZone, hoverTabOverPane, moveOverPane, paneSlot } from "./__util__";

test("10. Split right, Split down, Move here 영역을 서로 겹치지 않는 위치에 표시한다", async ({ page }) => {
  await page.goto("/");
  await page.locator("textarea").fill("a");
  for (const content of ["b", "c"]) {
    await addTabButton(page).click();
    await page.locator("textarea").fill(content);
  }
  const tab = (text: string) => page.locator(".tab-item").filter({ hasText: new RegExp(`^${text}$`) });
  const zone = (pane: string, label: string) => paneSlot(page, pane).locator(".note-pane-drop", { hasText: label });
  const left = paneSlot(page, "left");
  const leftBody = (await left.locator(".body").boundingBox())!;

  // Without a right column, Split right covers the right half of the left pane.
  const release = await hoverTabOverPane(page, tab("c"), left, 0.25, 0.4);
  await expect(zone("left", "Split right")).toBeVisible();
  let rightBox = (await zone("left", "Split right").boundingBox())!;
  expect(rightBox.x).toBeCloseTo(leftBody.x + leftBody.width / 2, 0);
  expect(rightBox.x + rightBox.width).toBeCloseTo(leftBody.x + leftBody.width, 0);
  expect(rightBox.y).toBeCloseTo(leftBody.y, 0);
  expect(rightBox.y + rightBox.height).toBeCloseTo(leftBody.y + leftBody.height, 0);

  // With both split zones, Split right takes the upper-right quarter and Split down the bottom half.
  await moveOverPane(page, left, 0.25, 0.75);
  await expect(zone("left", "Split down")).toBeVisible();
  rightBox = (await zone("left", "Split right").boundingBox())!;
  const downBox = (await zone("left", "Split down").boundingBox())!;
  expect(rightBox.x).toBeCloseTo(leftBody.x + leftBody.width / 2, 0);
  expect(rightBox.y + rightBox.height).toBeCloseTo(leftBody.y + leftBody.height / 2, 0);
  expect(downBox.x).toBeCloseTo(leftBody.x, 0);
  expect(downBox.width).toBeCloseTo(leftBody.width, 0);
  expect(downBox.y).toBeCloseTo(leftBody.y + leftBody.height / 2, 0);
  await release();

  // Move here uses the rest of the pane that no split zone covers.
  await dragTabToZone(page, tab("c"), left, "Split right");
  const right = paneSlot(page, "right");
  const rightBody = (await right.locator(".body").boundingBox())!;
  const releaseMove = await hoverTabOverPane(page, tab("b"), right, 0.25, 0.75);
  await expect(zone("right", "Split down")).toBeVisible();
  const moveBox = (await zone("right", "Move here").boundingBox())!;
  const rightDownBox = (await zone("right", "Split down").boundingBox())!;
  expect(moveBox.y).toBeCloseTo(rightBody.y, 0);
  expect(moveBox.width).toBeCloseTo(rightBody.width, 0);
  expect(moveBox.y + moveBox.height).toBeLessThanOrEqual(rightDownBox.y + 1);
  await releaseMove();
});
