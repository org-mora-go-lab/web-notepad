import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnce } from "../../__util__";

test("7. 오른쪽 활성 탭을 닫은 후 새로고침해도 새 활성 탭과 pane을 유지한다", async ({ page }) => {
  const group = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [
      createTabFixture("left", "Left"),
      createTabFixture("right-a", "Right A"),
      createTabFixture("right-b", "Right B"),
    ],
    {
      rightTabIds: ["right-a", "right-b"],
      activeRightTabId: "right-b",
      activePane: "right",
    },
  );
  await seedStoredStateOnce(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 4,
  });

  const rightPane = page.locator('.pane-slot[data-pane="right"]');
  await rightPane.getByRole("button", { name: "Close Right B" }).click();
  await expect(rightPane.locator("textarea")).toHaveValue("Right A");
  await expect.poll(() => {
    const params = new URL(page.url()).searchParams;
    return { pane: params.get("pane"), rightTab: params.get("rightTab") };
  }).toEqual({ pane: "right", rightTab: "right-a" });

  await page.reload();
  await expect(rightPane.locator("textarea")).toHaveValue("Right A");
  await expect(rightPane.locator("textarea")).toBeFocused();
  await expect(rightPane.locator(".note-pane")).not.toHaveClass(/is-unfocused/);
});
