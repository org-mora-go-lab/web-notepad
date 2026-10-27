import { expect, test } from "@playwright/test";

test("9. 대시보드 확장 명령은 눌림 상태와 이름을 함께 전환한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  const expand = page.getByRole("button", { name: "Expand dashboard" });
  await expect(expand).toHaveAttribute("aria-pressed", "false");
  await expand.click();
  await expect(
    page.getByRole("button", { name: "Collapse dashboard" }),
  ).toHaveAttribute("aria-pressed", "true");
});
