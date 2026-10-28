import { expect, test } from "@playwright/test";

test("9. 닫기 버튼으로 사이드바를 닫으면 명령의 펼침 상태를 해제한다", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Toggle groups" });
  await trigger.click();
  await page.getByRole("button", { name: "Close Menu" }).click();
  await expect(page.locator("#groups-menu")).toHaveCount(0);
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
