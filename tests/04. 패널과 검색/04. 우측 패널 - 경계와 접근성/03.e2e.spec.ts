import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";

test("3. PC에서 패널 바깥을 클릭해도 고정 패널을 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await page.mouse.click(5, 200);
  await expect(page.locator("#dashboard-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(page.locator(".dashboard .side-panel-backdrop")).toBeHidden();
});
