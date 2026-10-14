import { expect, test } from "@playwright/test";

import {
  closeActiveTabWithContent,
  closedContents,
  createGroups,
  openClosedPanel,
} from "../../__util__";

test("6. 그룹 이름과 탭 제목 및 내용을 대소문자 구분 없이 부분 검색한다", async ({ page }) => {
  await page.goto("/");
  await closeActiveTabWithContent(page, "Alpha title\nneedle body");
  await createGroups(page, "Work");
  await closeActiveTabWithContent(page, "Beta title\nother body");
  await openClosedPanel(page);

  const search = page.getByRole("searchbox", { name: "Search closed" });
  const contents = closedContents(page);
  await search.fill("ALPHA");
  await expect(contents).toHaveText(["Alpha title\nneedle body"]);
  await search.fill("need");
  await expect(contents).toHaveText(["Alpha title\nneedle body"]);
  await search.fill("wor");
  await expect(contents).toHaveText(["Beta title\nother body"]);
});
