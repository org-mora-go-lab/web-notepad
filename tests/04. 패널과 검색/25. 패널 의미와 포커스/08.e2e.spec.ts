import { expect, test } from "@playwright/test";

test("8. 한 패널을 열면 다른 사이드 패널은 inert 상태를 유지한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await expect(page.locator("#dashboard-panel")).not.toHaveAttribute(
    "inert",
    "",
  );
  await expect(page.locator("#bookmarks-panel")).toHaveAttribute("inert", "");
});
