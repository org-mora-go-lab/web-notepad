import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("10. 게시판 데이터 수신 동안 스켈레톤을 표시하고 완료 후 테이블을 렌더링한다", async ({
  page,
  boardPost,
}) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/api/board", async (route) => {
    await gate;
    await route.continue();
  });
  try {
    await page.goto("/");
    await openBoard(page);
    const skeleton = page.locator(".board-skeleton");
    await expect(skeleton).toBeVisible();
    await expect(page.locator(".board-content")).toHaveAttribute(
      "aria-busy",
      "true",
    );
    await expect(skeleton.locator(".board-skeleton-row")).toHaveCount(5);
    await expect(page.locator(".board-table")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(
      skeleton.locator(".board-skeleton-row span").first(),
    ).toHaveCSS("animation-name", "none");
  } finally {
    release();
  }
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(boardPost.title);
  await expect(page.locator(".board-entry")).toHaveCount(1);
  await expect(page.locator(".board-skeleton")).toHaveCount(0);
});
