import { expect, test } from "@playwright/test";

test("8. 조절한 PC 사이드바 너비를 새로고침 후 복원한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  const handle = (await page.getByRole("separator", { name: "Resize group panel" }).boundingBox())!;
  await page.mouse.move(handle.x + 1, handle.y + 30);
  await page.mouse.down();
  await page.mouse.move(360, handle.y + 30);
  await page.mouse.up();
  await page.reload();
  await page.getByRole("button", { name: "Toggle sidebar" }).click();
  expect((await page.locator("#groups-menu").boundingBox())!.width).toBeCloseTo(360, 0);
});
