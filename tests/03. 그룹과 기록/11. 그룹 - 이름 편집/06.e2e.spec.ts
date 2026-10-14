import { expect, test } from "@playwright/test";

import { readActiveGroup } from "../../__util__";
import { renameWorkGroup } from "./__util__";

test("6. 그룹 이름을 바꿔도 그룹의 노트를 유지하고 새로고침 후 복원한다", async ({ page }) => {
  await renameWorkGroup(page);

  expect((await readActiveGroup(page)).tabs[0].content).toBe("private note");
  await expect(page.locator("textarea")).toHaveValue("private note");
  await page.reload();
  expect((await readActiveGroup(page)).tabs[0].content).toBe("private note");
  await expect(page.locator("textarea")).toHaveValue("private note");
});
