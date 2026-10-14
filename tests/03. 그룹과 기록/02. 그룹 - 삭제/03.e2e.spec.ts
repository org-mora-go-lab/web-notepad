import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import { seedDeletableGroup } from "./__util__";

test("3. 삭제 팝업의 닫기 버튼은 그룹과 노트·북마크를 유지한다", async ({ page }) => {
  const { toggle, openDelete, popup } = await seedDeletableGroup(page);
  await toggle.click();
  await openDelete();
  await popup.getByRole("button", { name: "Close delete group confirmation" }).click();

  const group = (await readStoredState(page)).groups.find((item) => item.name === "Archive")!;
  expect(group.tabs[0].content).toBe("archived note");
  expect(group.bookmarks[0].content).toBe("archived note");
});
