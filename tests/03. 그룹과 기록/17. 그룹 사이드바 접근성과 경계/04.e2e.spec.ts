import { expect, test } from "@playwright/test";
test("4. 그룹 영역 버튼은 고유한 실제 목록과 펼침 상태를 제공한다", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle groups" }).click();
  const controls = [];
  for (const name of ["My Group", "Shared Group"]) {
    const button = page.getByRole("button", { name, exact: true });
    await expect(button).toHaveAttribute("aria-expanded", "true");
    const id = await button.getAttribute("aria-controls");
    expect(id).toBeTruthy();
    controls.push(id);
    await expect(page.locator("#" + id)).toBeVisible();
  }
  expect(new Set(controls).size).toBe(2);
});
