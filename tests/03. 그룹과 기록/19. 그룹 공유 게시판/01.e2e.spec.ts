import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("1. 더보기의 게시판은 공유 그룹을 표시하고 방문자에게 관리 버튼을 노출하지 않는다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  let releaseBoard!: () => void;
  const boardResponse = new Promise<void>((resolve) => {
    releaseBoard = resolve;
  });
  await page.route("**/api/board", async (route) => {
    await boardResponse;
    await route.continue();
  });
  await openBoard(page);
  const skeletonRowHeight = (await page
    .locator(".board-skeleton-row")
    .first()
    .boundingBox())!.height;
  releaseBoard();
  await page
    .getByRole("searchbox", { name: "Search shared groups" })
    .fill(boardPost.title);
  await expect(
    page.getByRole("table", { name: "Shared groups" }),
  ).toBeVisible();
  await expect(page.getByRole("columnheader")).toHaveText([
    "Group",
    "Shared by",
    "Notes",
    "Members",
    "Updated",
  ]);
  const [groupHeader, ownerHeader] = await page
    .getByRole("columnheader")
    .evaluateAll((headers) =>
      headers.slice(0, 2).map((header) => ({
        paddingLeft: getComputedStyle(header).paddingLeft,
        paddingRight: getComputedStyle(header).paddingRight,
      })),
    );
  expect(Number.parseFloat(groupHeader.paddingRight)).toBe(11);
  expect(Number.parseFloat(ownerHeader.paddingLeft)).toBe(11);
  const entry = page.locator(".board-entry").filter({
    hasText: boardPost.groupName,
  });
  await expect(entry).toHaveCount(1);
  const boardRowHeight = (await entry
    .locator("xpath=ancestor::tr")
    .boundingBox())!.height;
  expect(Math.abs(skeletonRowHeight - boardRowHeight)).toBeLessThanOrEqual(1);
  await expect(entry.locator("svg")).toHaveCount(0);
  await expect(entry).toHaveCSS("min-width", "150px");
  const owner = entry.locator("xpath=ancestor::tr").locator(".board-owner");
  await expect(owner).toHaveText("Board owner");
  await expect(owner.locator("svg")).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Publish a group" }),
  ).toHaveCount(0);
});
