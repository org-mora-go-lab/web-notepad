import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, readActiveGroup } from "../../__util__";
import { dropCard, seedCards } from "./__util__";

test("3. 다른 상태의 카드 위로 드롭하면 해당 위치로 상태와 순서를 함께 변경한다", async ({
  page,
}) => {
  await seedCards(page);
  await page.locator(".dirty-dot").first().click();
  await openPanel(page, "dashboard-panel");
  const ready = dashboardColumn(page, "ready").locator(".dashboard-card");
  const beta = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "Beta",
  });
  await dropCard(page, beta, ready.filter({ hasText: "Alpha" }));
  await expect(ready.locator("strong")).toHaveText(["Beta", "Alpha"]);
  const tab = (await readActiveGroup(page)).tabs.find(
    (tab) => tab.title === "Beta",
  )!;
  expect(tab.dashboardStatus).toBe("ready");
  expect(tab.tabColor).toBe("orange");
  expect(tab.content).toBe("Beta\nkept body");
});
