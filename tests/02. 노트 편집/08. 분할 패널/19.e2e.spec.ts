import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";
import { dragTabToZone, paneSlot, seedAllGroupState } from "./__util__";

test("19. All Group을 4분할하고 탭 이동·그룹 전환·새로고침 후 배치를 유지한다", async ({ page }) => {
  await seedAllGroupState(page);
  const tab = (title: string) => page.getByRole("tab", { name: title, exact: true }).locator("..");
  await dragTabToZone(page, tab("d"), paneSlot(page, "left"), "Split down");
  await dragTabToZone(page, tab("c"), paneSlot(page, "left"), "Split right");
  await dragTabToZone(page, tab("b"), paneSlot(page, "right"), "Split down");
  await expect(page.locator(".pane-slot")).toHaveCount(4);
  await page.getByRole("tab", { name: "d", exact: true }).click();
  await expect(paneSlot(page, "left-bottom").locator(".note-pane")).not.toHaveClass(/is-unfocused/);
  await switchGroup(page, "Work");
  await expect(page.locator(".pane-slot")).toHaveCount(1);
  await switchGroup(page, "All Group");
  await page.reload();
  await expect(page.locator(".pane-slot")).toHaveCount(4);
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue("d");
  await tab("b").locator(".tab-title").dragTo(paneSlot(page, "left").locator(".header"));
  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(paneSlot(page, "left").getByRole("tab", { name: "b", exact: true })).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(paneSlot(page, "left").locator("textarea")).toHaveValue("b");
});
