import { expect, test } from "@playwright/test";

import { dragTabToZone, paneSlot, seedAllGroupState } from "../__util__";

test("6. All Group 새 탭은 현재 패널과 Ungrouped에 저장한다", async ({
  page,
}) => {
  await seedAllGroupState(page);
  const tab = page.getByRole("tab", { name: "d", exact: true }).locator("..");
  await dragTabToZone(page, tab, paneSlot(page, "left"), "Split right");
  const right = paneSlot(page, "right");
  await right.getByRole("button", { name: "New tab" }).click();
  await right.locator("textarea").fill("new");

  await expect(
    right.getByRole("tab", { name: "new", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const owner = await page.evaluate(() => {
    const groups = JSON.parse(localStorage.getItem("web-notepad-storage")!)
      .state.groups;
    return groups.find((group: { tabs: { content: string }[] }) =>
      group.tabs.some((item) => item.content === "new"),
    ).id;
  });
  expect(owner).toBe("ungrouped");
});
