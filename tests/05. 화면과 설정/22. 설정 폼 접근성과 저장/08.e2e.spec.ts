import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";

test("8. 설정 초기화 버튼은 접근 가능한 이름과 툴팁을 제공한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  await expect(page.getByRole("button", { name: "Reset settings" })).toHaveAttribute("title", "Reset settings");
});
