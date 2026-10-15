import { expect, test } from "@playwright/test";

import { MOBILE_VIEWPORT } from "../../__constant__";
import { openPanel } from "../../__util__";
import { dashboardColumn, seedDashboardTabs } from "../__util__";

test("2. 모바일 상태 클릭 시 수정 아이콘을 2초 동안 표시하고 이름을 편집한다", async ({
  page,
}) => {
  await page.setViewportSize(MOBILE_VIEWPORT);
  await seedDashboardTabs(page);
  await openPanel(page, "dashboard-panel");
  const status = dashboardColumn(page, "todo").locator(
    ".dashboard-column-status",
  );
  const edit = status.getByRole("button", { name: "Edit Todo status name" });

  await status.click();
  await expect(edit).toHaveCSS("opacity", "1");
  await page.waitForTimeout(2100);
  await expect(edit).toHaveCSS("opacity", "0");

  await status.click();
  await edit.click();
  const input = status.getByRole("textbox", { name: "Edit Todo status name" });
  await input.fill("Next up");
  await input.press("Enter");
  await expect(status.locator(".dashboard-status-label")).toHaveText("Next up");
});
