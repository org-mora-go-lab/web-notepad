import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedAllGroupState } from "../__util__";

test("9. All Group 분할 편집기의 새 탭을 닫으면 원래 탭으로 돌아온다", async ({ page }) => {
  await seedAllGroupState(page);
  const tab = page.getByRole("tab", { name: "d", exact: true }).locator("..");
  await dragTabToZone(page, tab, paneSlot(page, "left"), "Split right");
  const right = paneSlot(page, "right");
  await right.getByRole("button", { name: "New tab" }).click();
  await right.locator("textarea").fill("new");

  await right.getByRole("button", { name: "Close new", exact: true }).click();
  await expect(right.locator("textarea")).toHaveValue("d");
});
