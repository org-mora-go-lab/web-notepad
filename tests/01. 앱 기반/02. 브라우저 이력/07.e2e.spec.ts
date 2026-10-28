import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { authenticateBrowser } from "../../__util__";

test("7. 보드에서 메모로 돌아올 때 편집기에 자동 포커스하지 않는다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.goto("/board");
    await expect(page.locator(".board-content")).toHaveAttribute(
      "aria-busy",
      "false",
    );
    await page.goBack();

    const editor = page.locator(".note-area").first();
    await expect(editor).toBeVisible();
    await expect(editor).not.toBeFocused();

    await editor.click();
    await expect(editor).toBeFocused();
    await page.locator("button.auth-command").click();
    await page.getByRole("menuitem", { name: "Board", exact: true }).click();
    await expect(page).toHaveURL(/\/board$/);
    await page.getByRole("link", { name: "Back to notes" }).click();
    await expect(editor).toBeVisible();
    await expect(editor).not.toBeFocused();
  }
});
