import { expect, test } from "@playwright/test";

test("1. 닫힌 사이드 패널은 aria-hidden과 inert로 상호작용을 차단한다", async ({
  page,
}) => {
  await page.goto("/");
  const panel = page.locator("#dashboard-panel");
  await expect(panel).toHaveAttribute("aria-hidden", "true");
  await expect(panel).toHaveAttribute("inert", "");
});
