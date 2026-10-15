import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("6. 오른쪽 탭 선택을 URL 이력으로 기록하고 탭과 pane 포커스를 복원한다", async ({ page }) => {
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
      activeRightTabId: "right-a",
      activePane: "right",
    },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 4,
  });

  const rightPane = page.locator('.pane-slot[data-pane="right"]');
  const editor = rightPane.locator("textarea");
  await rightPane.getByRole("tab", { name: "Right B" }).click();
  await expect(editor).toHaveValue("Right B");
  await expect(editor).toBeFocused();
  await expect.poll(() => new URL(page.url()).searchParams.get("rightTab")).toBe("right-b");

  await page.goBack();
  await expect(editor).toHaveValue("Right A");
  await expect(editor).toBeFocused();
  await page.goForward();
  await expect(editor).toHaveValue("Right B");
  await expect(editor).toBeFocused();
});
