import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("7. 탭 클릭 후 Shift 클릭으로 연속된 탭 범위를 선택한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  for (const title of ["first", "second", "third", "fourth"]) {
    await editor.fill(title);
    if (title !== "fourth") await addTabButton(page).click();
  }

  const tabs = page.locator(".tab-item");
  await tabs.nth(3).getByRole("tab").click();
  await tabs.nth(1).getByRole("tab").click({ modifiers: ["Shift"] });

  await expect(tabs.filter({ has: page.locator(".tab-select") })).toHaveCount(4);
  await expect(tabs.nth(0)).not.toHaveClass(/is-range-selected/);
  for (const index of [1, 2, 3])
    await expect(tabs.nth(index)).toHaveClass(/is-range-selected/);
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 800 });
    const boundary = await page.locator(".header").first().evaluate(el => el.getBoundingClientRect().bottom - parseFloat(getComputedStyle(el).borderBottomWidth));
    for (const index of [1, 2, 3]) {
      const tab = tabs.nth(index);
      expect((await tab.boundingBox())!.y + (await tab.boundingBox())!.height).toBeLessThanOrEqual(boundary + 0.1);
      expect(await tab.evaluate(el => getComputedStyle(el).boxShadow)).not.toContain("-2px");
    }
  }
});
