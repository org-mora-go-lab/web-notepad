import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";
import { paneSlot } from "../__util__";
import { createAllGroupQuad } from "./__util__";

test("5. 그룹을 전환했다 돌아와도 All Group의 활성 탭과 편집기를 유지한다", async ({ page }) => {
  await createAllGroupQuad(page);
  await page.getByRole("tab", { name: "d", exact: true }).click();
  await switchGroup(page, "Work");
  await switchGroup(page, "All Group");

  await expect(paneSlot(page, "left-bottom").locator(".note-pane")).not.toHaveClass(/is-unfocused/);
  await expect(paneSlot(page, "left-bottom").locator("textarea")).toHaveValue("d");
});
