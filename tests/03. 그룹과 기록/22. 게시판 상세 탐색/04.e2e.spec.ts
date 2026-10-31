import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("4. PC 노트 편집기는 높이를 고정하고 탭 전환 때 본문을 흔들지 않는다", async ({
  page,
  boardPost,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await openBoard(page);
  await selectBoardPost(page, boardPost.title, boardPost.id);
  const preview = page.locator(".board-note-preview");
  const tabs = page.getByRole("tab");
  const before = (await preview.boundingBox())!;

  expect(before.height).toBeCloseTo(475.2, 0);
  await expect(preview).toHaveCSS("resize", "none");
  await expect(page.getByTestId("board-note-resizer")).toHaveCount(0);
  await tabs.nth(1).click();

  const after = (await preview.boundingBox())!;
  expect(after.x).toBeCloseTo(before.x, 0);
  expect(after.y).toBeCloseTo(before.y, 0);
  expect(after.width).toBeCloseTo(before.width, 0);
  expect(after.height).toBeCloseTo(before.height, 0);
  await expect(preview).toHaveCSS("animation-name", "none");
  await expect(preview).toHaveCSS("transform", "none");

  await page.setViewportSize({ width: 390, height: 844 });
  await tabs.nth(2).click();
  await expect(preview).toHaveCSS("animation-name", "board-note-slide-left");
  await expect(preview).toHaveCSS("resize", "none");
});
