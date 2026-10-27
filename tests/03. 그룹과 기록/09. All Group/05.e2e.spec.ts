import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedAllGroupOriginTabs } from "./__fixture__";

test("5. All Group에서 탭을 닫으면 원래 그룹에 숨긴 상태로 유지한다", async ({
  page,
}) => {
  await seedAllGroupOriginTabs(page);
  const workTab = page
    .locator(".tab-item")
    .filter({ hasText: "Work only task" });
  await workTab.getByRole("tab").click();
  await workTab.locator(".tab-close").click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);

  const work = (await readStoredState(page)).groups.find(
    (group) => group.id === "work",
  )!;
  expect(work.tabs.find((tab) => tab.id === "work-tab")?.open).toBe(false);
  expect((await readStoredState(page)).closedTabs).toEqual([]);
});
