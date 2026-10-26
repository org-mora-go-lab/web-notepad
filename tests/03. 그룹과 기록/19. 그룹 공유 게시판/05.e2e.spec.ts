import { expect } from "@playwright/test";

import { boardTest as test } from "../../__fixture__";
import { openBoard } from "../../__util__";

test("5. 검색은 그룹 이름의 일부를 찾고 결과가 없을 때 명확하게 안내한다", async ({
  page,
  boardPost,
}) => {
  await page.goto("/");
  await openBoard(page);
  const search = page.getByRole("searchbox", { name: "Search shared groups" });
  await search.fill(boardPost.title);
  await expect(page.locator(".board-entry")).toHaveCount(1);
  await search.fill(boardPost.groupName.split(" ").at(-1)!);
  await expect(
    page.locator(".board-entry", { hasText: boardPost.title }),
  ).toBeVisible();
  await search.fill("missing-" + crypto.randomUUID());
  await expect(page.getByText("No matching groups")).toBeVisible();
});
