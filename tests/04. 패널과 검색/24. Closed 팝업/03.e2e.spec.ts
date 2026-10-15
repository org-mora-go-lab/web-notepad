import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, readStoredState } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("3. Todo·Doing·Done과 Icebox 사이에서 카드를 자유롭게 이동한다", async ({ page }) => {
  await seedClosedPanelState(page);
  await openPanel(page, "dashboard-panel");
  await page.locator(".dashboard-icebox-command").click();
  const card = (status: "icebox" | "todo" | "in-progress" | "done") =>
    dashboardColumn(page, status).locator(".dashboard-card", {
      hasText: "Open note",
    });
  const storedTab = async () =>
    (await readStoredState(page)).groups[0].tabs.find(
      (tab) => tab.id === "open-1",
    );

  await card("todo").dragTo(dashboardColumn(page, "icebox"));
  expect((await storedTab())?.dashboardStatus).toBe("icebox");
  await card("icebox").dragTo(dashboardColumn(page, "in-progress"));
  expect(await storedTab()).toMatchObject({ tabColor: "green" });

  await card("in-progress").dragTo(dashboardColumn(page, "icebox"));
  await card("icebox").dragTo(dashboardColumn(page, "done"));
  expect(await storedTab()).toMatchObject({ tabColor: "purple" });

  await card("done").dragTo(dashboardColumn(page, "icebox"));
  await card("icebox").dragTo(dashboardColumn(page, "todo"));
  expect(await storedTab()).toMatchObject({ tabColor: "gray" });
  expect((await storedTab())?.dashboardStatus).toBeUndefined();
});
