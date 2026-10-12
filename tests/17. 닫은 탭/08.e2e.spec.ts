import { expect, test } from "@playwright/test";

import { closeActiveTabWithContent, openClosedPanel } from "../__util__";

test("8. 닫은 탭 내용은 접지 않은 전체 내용으로 항상 표시하고 더보기·간소화 버튼을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  const lines = Array.from({ length: 10 }, (_, index) => `line ${index}`);
  await closeActiveTabWithContent(page, lines.join("\n"));
  await openClosedPanel(page);

  const content = page.locator(".closed-item-content");
  await expect(content).toHaveText(lines.join("\n"), { useInnerText: true });
  expect(await content.evaluate((element) => element.scrollHeight <= element.clientHeight)).toBe(true);
  await expect(page.locator(".closed-item").getByRole("button", { name: /더보기|간소화/ })).toHaveCount(0);
});
