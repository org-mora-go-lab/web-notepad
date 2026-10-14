import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";
import { paneSlot } from "../__util__";
import { createAllGroupQuad } from "./__util__";

test("6. 그룹을 전환했다 돌아오면 All Group의 4분할 배치를 복원한다", async ({ page }) => {
  await createAllGroupQuad(page);
  await switchGroup(page, "Work");
  await switchGroup(page, "All Group");

  await expect(page.locator(".pane-slot")).toHaveCount(4);
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue("d");
  await expect(paneSlot(page, "right-bottom").locator("textarea")).toHaveValue("b");
});
