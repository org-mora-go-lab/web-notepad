import { expect, type Locator, test } from "@playwright/test";

async function expectTextAndIconCentered(button: Locator) {
  const textBounds = (await button.locator(":scope > span").boundingBox())!;
  const iconBounds = (await button.locator(":scope > svg").boundingBox())!;
  expect(textBounds.y + textBounds.height / 2).toBeCloseTo(
    iconBounds.y + iconBounds.height / 2,
    0,
  );
}

test("5. 사용자 가이드의 Previous·Next 텍스트와 아이콘을 세로 중앙 정렬한다", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await page.getByRole("menuitem", { name: "GUIDE" }).click();

  const guide = page.locator(".user-guide");
  await expectTextAndIconCentered(guide.getByRole("button", { name: "Previous" }));
  await expectTextAndIconCentered(guide.getByRole("button", { name: "Next" }));
});
