import { expect, test } from "@playwright/test";

test("8. 사용 가이드는 진행 표시 오른쪽의 텍스트 없는 X 버튼으로 닫는다", async ({ page }) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "MENU", exact: true });
  const guide = page.getByRole("dialog");
  const openGuide = async () => {
    await trigger.click();
    await page.locator(".additional-tools-guide").click();
    await expect(guide).toBeVisible();
  };

  await openGuide();
  await guide.getByRole("button", { name: "Next" }).click();
  const progress = guide.locator(".user-guide-progress");
  const stop = guide.getByRole("button", { name: "Stop viewing" });
  await expect(progress).toHaveText("2 / 10");
  await expect(stop).toHaveText("");
  const progressBox = (await progress.boundingBox())!;
  const stopBox = (await stop.boundingBox())!;
  expect(stopBox.x).toBeGreaterThanOrEqual(progressBox.x + progressBox.width);
  await stop.click();
  await expect(guide).toHaveCount(0);
});
