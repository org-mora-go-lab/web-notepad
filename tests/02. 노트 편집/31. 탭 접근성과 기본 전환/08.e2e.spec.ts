import { expect, test } from "@playwright/test";

test("8. 활성 탭을 닫으면 남은 탭 하나만 선택 상태를 가진다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  await page.locator(".tab-item.is-active .tab-close").click();
  await expect(page.getByRole("tab", { selected: true })).toHaveCount(1);
});
