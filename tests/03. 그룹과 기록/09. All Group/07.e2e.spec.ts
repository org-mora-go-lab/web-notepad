import { expect, test } from "@playwright/test";

import { createGroups, readStoredState, switchGroup } from "../../__util__";

test("7. All Group의 새 탭 명령은 기존 빈 탭을 재사용하고 작성 후에는 새 빈 탭을 만든다", async ({
  page,
}) => {
  await page.goto("/");
  await createGroups(page, "Alpha", "Beta");
  await switchGroup(page, "All Group");
  const before = (await readStoredState(page)).groups.reduce(
    (count, group) => count + group.tabs.length,
    0,
  );
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(1);
  expect(
    (await readStoredState(page)).groups.reduce(
      (count, group) => count + group.tabs.length,
      0,
    ),
  ).toBe(before);
  await page.locator("textarea").fill("All Group draft");
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  await expect(page.getByRole("tab")).toHaveCount(2);
  await expect(page.locator("textarea")).toHaveValue("");
});
