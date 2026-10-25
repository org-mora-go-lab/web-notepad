import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("5. 검색은 제목과 소개를 찾고 결과가 없을 때 명확하게 안내한다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  const search = page.getByRole("searchbox", { name: "Search shared groups" });
  await search.fill(boardPost.title);
  await expect(page.locator(".board-card")).toHaveCount(1);
  await search.fill("weekly ideas");
  await expect(
    page.locator(".board-card", { hasText: boardPost.title }),
  ).toBeVisible();
  await search.fill("missing-" + crypto.randomUUID());
  await expect(page.getByText("No matching groups")).toBeVisible();
});
