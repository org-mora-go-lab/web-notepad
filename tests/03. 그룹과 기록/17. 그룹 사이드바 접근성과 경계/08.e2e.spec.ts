import { expect, test } from "@playwright/test";

test("8. PC 사이드바는 192px까지 줄이고 조절한 너비를 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle groups" }).click();
  const handle = (await page.getByRole("separator", { name: "Resize group panel" }).boundingBox())!;
  await page.mouse.move(handle.x + 1, handle.y + 30);
  await page.mouse.down();
  await page.mouse.move(120, handle.y + 30);
  await page.mouse.up();
  await page.getByRole("button", { name: "Close Groups" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Toggle groups" }).click();
  expect((await page.locator("#groups-menu").boundingBox())!.width).toBeCloseTo(192, 0);
});
