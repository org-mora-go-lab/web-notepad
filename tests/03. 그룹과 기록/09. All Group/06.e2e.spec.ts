import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedAllGroupOriginTabs } from "./__fixture__";

test("6. All Group에서 기존 탭의 색상을 바꾸면 원래 소속 그룹에 반영한다", async ({ page }) => {
  await seedAllGroupOriginTabs(page);
  const workTab = page.locator(".tab-item").filter({ hasText: "Work only task" });
  await workTab.getByRole("tab").click();
  await workTab.locator(".dirty-dot").click();

  const work = (await readStoredState(page)).groups.find((group) => group.id === "work")!;
  expect(work.tabs[0].tabColor).toBe("purple");
});
