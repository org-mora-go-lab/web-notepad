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
    [".board-owner", 17],
    [".board-meta", 15],
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
  await expect(page.locator(".board-detail-summary")).toHaveCount(0);
  await expect(page.locator(".board-detail h3")).toHaveCount(0);
  await expect(page.locator(".board-group-name")).toHaveCount(0);
  await expect(page.locator(".board-description")).toHaveCount(0);
  const sharedNotesBounds = (await page
    .locator(".board-note-contents")
    .boundingBox())!;
  const heroBounds = (await page.locator(".board-detail-hero").boundingBox())!;
  expect(sharedNotesBounds.y).toBeLessThan(heroBounds.y);
  const noteLayout = await page
    .locator(".board-note-preview")
    .evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        height: Number.parseFloat(style.height),
        minHeight: Number.parseFloat(style.minHeight),
        maxHeight: style.maxHeight,
        overflowY: style.overflowY,
        resize: style.resize,
      };
    });
  expect(noteLayout.height).toBeCloseTo(220 * 1.2 * 1.2, 0);
  expect(noteLayout.minHeight).toBeCloseTo(noteLayout.height, 0);
  expect(noteLayout.maxHeight).toBe("none");
  expect(noteLayout.overflowY).toBe("auto");
  expect(noteLayout.resize).toBe("none");
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
  await expect(page.locator(".board-note-preview")).toHaveCSS("resize", "none");
  await expect(page.locator(".board-note-contents > h4")).toHaveCount(0);
  const sharedNotesSection = (await page
    .locator(".board-note-contents")
    .boundingBox())!;
  const firstSharedNoteTab = (await page
    .locator(".board-note-tabs > button")
    .first()
    .boundingBox())!;
  expect(firstSharedNoteTab.x).toBeCloseTo(sharedNotesSection.x, 0);
  await expect(page.locator(".board-note-contents")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0)",
  );
  const preview = page.locator(".board-note-preview");
  const initialPreviewHeight = (await preview.boundingBox())!.height;
  const resizer = (await page.getByTestId("board-note-resizer").boundingBox())!;
  await page.mouse.move(
    resizer.x + resizer.width / 2,
    resizer.y + resizer.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    resizer.x + resizer.width / 2,
    resizer.y + resizer.height / 2 + 80,
  );
  await page.mouse.up();
  expect((await preview.boundingBox())!.height).toBeCloseTo(
    initialPreviewHeight + 80,
    0,
  );
  await expect(page.locator(".board-intro")).toHaveCount(0);
  await expect(page.locator(".board-detail-section")).toHaveCount(2);
  await expect(page.locator(".board-detail-hero.board-overview")).toHaveCount(
    1,
  );
  const desktopOverview = (await page
    .locator(".board-overview")
    .boundingBox())!;
  expect(desktopOverview.x).toBeCloseTo(sharedNotesBounds.x, 0);
  expect(desktopOverview.width).toBeCloseTo(sharedNotesBounds.width, 0);
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
  const mobileEditor = (await page
    .locator(".board-note-preview")
    .boundingBox())!;
  const mobileOverview = (await page.locator(".board-overview").boundingBox())!;
  expect(mobileEditor.x).toBeCloseTo(mobileOverview.x, 0);
  expect(mobileEditor.width).toBeCloseTo(mobileOverview.width, 0);
  const overviewTitle = (await page
    .locator("#board-overview-title")
    .boundingBox())!;
  const mobileOwner = (await page
    .locator(".board-overview-owner")
    .boundingBox())!;
  expect(mobileOwner.y).toBeGreaterThanOrEqual(
    overviewTitle.y + overviewTitle.height,
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
  await expect(tabs.locator(".board-note-title")).toHaveText([
    "Follow-up shared note body",
    "",
    "Private shared note body",
  ]);
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
  expect(boardPost.notes.some((note) => note.content === "Empty note")).toBe(
    false,
  );
  expect(boardPost.notes.some((note) => note.content === "")).toBe(true);
  await tabs.nth(1).click();
  await expect(page.locator(".board-note-preview")).not.toContainText(
    "Empty note",
  );
  await expect(page.locator(".board-note-line")).toHaveCount(1);
  await page.setViewportSize({ width: 360, height: 800 });
  await tabs.first().click();
  const swipe = async (from: number, to: number) => {
    await page.locator(".board-note-preview").evaluate(
      (element, points) => {
        const dispatch = (
          type: "touchstart" | "touchend",
          key: "touches" | "changedTouches",
          x: number,
        ) => {
          const event = new Event(type, { bubbles: true, cancelable: true });
          Object.defineProperty(event, key, {
            value: [{ clientX: x, clientY: 120 }],
          });
          element.dispatchEvent(event);
        };
        dispatch("touchstart", "touches", points.from);
        dispatch("touchend", "changedTouches", points.to);
      },
      { from, to },
    );
  };
  await swipe(300, 80);
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await swipe(80, 300);
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
});
