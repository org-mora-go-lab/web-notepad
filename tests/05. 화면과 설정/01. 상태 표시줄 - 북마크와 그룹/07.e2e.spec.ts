import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { groupsCommand, moreCommand } from "../../__util__";

test("7. MORE의 SETTINGS는 그룹 사이드바를 닫고 설정 패널을 연다", async ({
  page,
}) => {
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await groupsCommand(page).click();
    await moreCommand(page).click();
    const settings = page
      .locator("#group-more-menu")
      .getByRole("button", { name: "SETTINGS", exact: true });
    await expect(settings).toBeVisible();
    await settings.click();
    await expect(page.locator("#groups-menu")).toHaveCount(0);
    await expect(page.locator("#settings-panel")).toHaveAttribute(
      "aria-hidden",
      "false",
    );
  }
});
