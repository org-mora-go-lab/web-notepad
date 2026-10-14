import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedAllGroupState } from "./__util__";

test("20. All Group 분할 편집기에 새 탭을 추가하고 닫으면 빈 편집기를 정리한다", async ({ page }) => {
  await seedAllGroupState(page);
  const tab = page.getByRole("tab", { name: "d", exact: true }).locator("..");
  await dragTabToZone(page, tab, paneSlot(page, "left"), "Split right");
  const right = paneSlot(page, "right");
  await right.getByRole("button", { name: "새 탭 추가" }).click();
  await right.locator("textarea").fill("new");
  await expect(right.locator(".tab-title")).toHaveCount(2);
  await expect(right.getByRole("tab", { name: "d", exact: true })).toBeVisible();
  await expect(right.getByRole("tab", { name: "new", exact: true })).toHaveAttribute("aria-selected", "true");
  const owner = await page.evaluate(() => {
    const groups = JSON.parse(localStorage.getItem("web-notepad-storage")!).state.groups;
    return groups.find((group: { tabs: { content: string }[] }) => group.tabs.some((tab) => tab.content === "new")).id;
  });
  expect(owner).toBe("ungrouped");
  await right.getByRole("button", { name: "new 닫기", exact: true }).click();
  await expect(right.locator("textarea")).toHaveValue("d");
  await right.getByRole("button", { name: "d 닫기", exact: true }).click();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await page.reload();
  await expect(page.locator(".pane-slot")).toHaveCount(1);
});
