import { expect, test } from "@playwright/test";

import { readActiveGroup } from "../../__util__";
import { renameWorkGroup } from "./__util__";

test("8. 바꾼 그룹 이름은 새로고침 후에도 복원한다", async ({ page }) => {
  await renameWorkGroup(page);
  await page.reload();

  const group = await readActiveGroup(page);
  expect(group.name).toBe("Focus");
});
