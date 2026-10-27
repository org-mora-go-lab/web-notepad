import { expect, test } from "@playwright/test";

test("7. 탭을 전환하면 aria-selected 상태도 함께 이동한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  const tabs = page.getByRole("tab");
  await tabs.first().click();
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  await expect(tabs.last()).toHaveAttribute("aria-selected", "false");
});
