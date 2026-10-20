import { expect, test } from "@playwright/test";

import { readActiveGroup, restoreWorkspace } from "../../__util__";

test("2. 닫힌 탭이 분할 목록에 남아 있어도 편집기에 다시 열지 않는다", async ({
  page,
}) => {
  await restoreWorkspace(page, { rightTabIds: ["tab-4", "tab-2"] });
  const group = await readActiveGroup(page);
  expect(group.rightTabIds).toEqual(["tab-2"]);
  expect(group.tabs.find((tab) => tab.id === "tab-4")?.open).toBe(false);
  await expect(
    page.getByRole("tab", { name: "Hidden", exact: true }),
  ).toHaveCount(0);
});
