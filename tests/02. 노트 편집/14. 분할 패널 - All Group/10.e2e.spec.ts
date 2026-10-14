import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedAllGroupState } from "../__util__";

test("10. All Group 분할 편집기의 마지막 탭을 닫으면 빈 패널을 정리한다", async ({ page }) => {
  await seedAllGroupState(page);
  const tab = page.getByRole("tab", { name: "d", exact: true }).locator("..");
  await dragTabToZone(page, tab, paneSlot(page, "left"), "Split right");
  await paneSlot(page, "right").getByRole("button", { name: "Close d", exact: true }).click();

  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
});
