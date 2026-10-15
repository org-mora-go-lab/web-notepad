import { expect, test } from "@playwright/test";

test("6. 탭 제목은 이모지와 결합 문자를 깨뜨리지 않고 28개의 표시 문자로 제한한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  const title = page.locator(".tab-item.is-active .tab-title");

  const emojiTitle = `${"A".repeat(27)}😀`;
  await editor.fill(`${emojiTitle}Z`);
  await expect(title).toHaveText(emojiTitle);

  const combiningTitle = `${"B".repeat(27)}e\u0301`;
  await editor.fill(`${combiningTitle}Z`);
  await expect(title).toHaveText(combiningTitle);
});
