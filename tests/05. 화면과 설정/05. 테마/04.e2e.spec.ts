import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("4. 다른 브라우저 탭의 테마 변경을 현재 열린 앱에 반영한다", async ({ page, context }) => {
  await page.goto("/");
  const other = await context.newPage();
  await other.goto("/");
  await openSettingsPanel(other);
  await other.getByRole("switch", { name: "THEME" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await other.close();
});
