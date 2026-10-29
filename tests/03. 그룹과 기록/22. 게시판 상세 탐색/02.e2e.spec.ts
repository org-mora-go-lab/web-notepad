import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("2. 공유 그룹 보드 상세의 글자를 2px 키운다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  await selectBoardPost(page, boardPost.title);
  const fontScale = await page.evaluate(() =>
    Number(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--font-scale",
      ),
    ),
  );

  for (const [selector, size] of [
    [".board-back", 16],
    [".board-group-name", 15],
    [".board-owner", 17],
    [".board-detail h3", 27],
    [".board-meta", 15],
    [".board-description", 18],
    [".board-join-hint", 14],
    [".board-detail-actions .board-primary", 15],
    [".board-detail-actions .board-copy", 15],
  ] as const) {
    const actual = await page
      .locator(selector)
      .first()
      .evaluate((element) => parseFloat(getComputedStyle(element).fontSize));
    expect(actual).toBeCloseTo(size * fontScale, 1);
  }
  await expect(page.locator(".board-detail-hero")).toBeVisible();
  const noteLayout = await page
    .locator(".board-note-preview")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: Number.parseFloat(style.height),
        maxHeight: Number.parseFloat(style.maxHeight),
        overflowY: style.overflowY,
      };
    });
  expect(noteLayout.height).toBeCloseTo(220 * 1.2, 0);
  expect(noteLayout.maxHeight).toBeCloseTo(noteLayout.height, 0);
  expect(noteLayout.overflowY).toBe("auto");
  const noteText = await page
    .locator(".board-note-preview pre")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        color: style.color,
        fontSize: Number.parseFloat(style.fontSize),
        lineHeight: Number.parseFloat(style.lineHeight),
      };
    });
  expect(noteText.fontSize).toBeCloseTo(15 * fontScale, 1);
  expect(noteText.lineHeight / noteText.fontSize).toBeCloseTo(1.9, 1);
  expect(noteText.color).not.toBe("rgba(0, 0, 0, 0)");
  const gutter = await page
    .locator(".board-note-preview pre")
    .evaluate((element) => {
      const line = getComputedStyle(element, "::before");
      return {
        height: Number.parseFloat(line.height),
        preHeight: element.getBoundingClientRect().height,
      };
    });
  expect(gutter.height).toBeCloseTo(gutter.preHeight, 0);
  await expect(page.locator(".board-note-tabs")).toHaveCSS(
    "overflow-y",
    "hidden",
  );
  await expect(page.locator(".board-intro")).toHaveCount(0);
  await expect(page.locator(".board-detail-section")).toHaveCount(2);
  await expect(
    page.locator(".board-detail-hero > .board-overview"),
  ).toHaveCount(1);
  const desktopSummary = (await page
    .locator(".board-detail-summary")
    .boundingBox())!;
  const desktopOverview = (await page
    .locator(".board-overview")
    .boundingBox())!;
  expect(desktopOverview.x).toBeGreaterThan(desktopSummary.x);
  await expect(page.locator(".board-overview")).toHaveCSS(
    "align-self",
    "start",
  );
  const desktopNotesMetric = (await page
    .locator(".board-meta > span")
    .nth(0)
    .boundingBox())!;
  const desktopBookmarksMetric = (await page
    .locator(".board-meta > span")
    .nth(2)
    .boundingBox())!;
  await expect(
    page.locator(".board-meta > span").nth(2).locator("small"),
  ).toHaveText("Bookmarks");
  await expect(
    page.locator(".board-meta > span").nth(2).locator("strong"),
  ).toHaveText("1");
  expect(desktopBookmarksMetric.width).toBeCloseTo(desktopNotesMetric.width, 0);
  await page.setViewportSize({ width: 360, height: 800 });
  const mobileSummary = (await page
    .locator(".board-detail-summary")
    .boundingBox())!;
  const mobileOverview = (await page.locator(".board-overview").boundingBox())!;
  expect(mobileOverview.y).toBeGreaterThanOrEqual(
    mobileSummary.y + mobileSummary.height,
  );
  await expect(page.locator(".board-meta > span")).toHaveCount(4);
  await expect(page.locator(".board-meta time")).toHaveAttribute(
    "datetime",
    /\d{4}-\d{2}-\d{2}T/,
  );
  await expect(page.locator(".board-meta time")).toHaveCSS(
    "white-space",
    "nowrap",
  );
  await expect(page.getByRole("tab")).toHaveCount(boardPost.notes.length);
  const tabs = page.getByRole("tab");
  await expect(tabs.first()).toContainText("Follow-up shared note body");
  await expect(tabs.first().locator(".board-note-bookmark")).toHaveCount(1);
  await expect(tabs.nth(1).locator(".board-note-bookmark")).toHaveCount(0);
  const bookmarkBounds = (await tabs
    .first()
    .locator(".board-note-bookmark")
    .boundingBox())!;
  const bookmarkTitleBounds = (await tabs
    .first()
    .locator(".board-note-title")
    .boundingBox())!;
  expect(bookmarkBounds.x + bookmarkBounds.width).toBeLessThanOrEqual(
    bookmarkTitleBounds.x,
  );
  expect(bookmarkBounds.y + bookmarkBounds.height / 2).toBeCloseTo(
    bookmarkTitleBounds.y + bookmarkTitleBounds.height / 2,
    1,
  );
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".board-note-preview")).toHaveCount(1);
});
