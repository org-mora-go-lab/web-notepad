import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedAllGroupOriginTabs } from "./__fixture__";

test("4. All Group에서 탭 내용을 편집하면 원래 그룹에 반영한다", async ({
  page,
}) => {
  await seedAllGroupOriginTabs(page);
  await page.getByRole("tab", { name: "Work only task", exact: true }).click();
  await page.locator("textarea").fill("Work only task edited");

  const work = (await readStoredState(page)).groups.find(
    (group) => group.id === "work",
  )!;
  expect(work.tabs[0].content).toBe("Work only task edited");
});
