import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedDeletableGroup } from "./__util__";

test("4. Escape로 삭제 팝업을 닫으면 그룹과 노트·북마크를 유지한다", async ({ page }) => {
  const { toggle, openDelete, popup } = await seedDeletableGroup(page);
  await toggle.click();
  await openDelete();
  await page.keyboard.press("Escape");

  await expect(popup).toHaveCount(0);
  const group = (await readStoredState(page)).groups.find((item) => item.name === "Archive")!;
  expect(group.tabs[0].content).toBe("archived note");
  expect(group.bookmarks[0].content).toBe("archived note");
});
