import { expect, test } from "@playwright/test";

test("1. 검색 명령은 팝업 제어 대상과 펼침 상태를 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".more-command").click();
  const trigger = page.getByRole("button", { name: "SEARCH", exact: true });
  await expect(trigger).toHaveAttribute("aria-controls", "global-search-popup");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await trigger.click();
  await expect(page.locator("#global-search-popup")).toBeVisible();
  await expect(page.locator(".more-command")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});
