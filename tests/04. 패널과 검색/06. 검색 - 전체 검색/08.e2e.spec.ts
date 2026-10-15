import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openGlobalSearchPanel } from "../../__util__";

test("8. PC 검색 팝업의 우측 경계를 드래그해 가로 크기를 조절한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await openGlobalSearchPanel(page);
  const popup = page.locator("#global-search-popup");
  const resizer = popup.getByRole("separator", { name: "Resize search popup" });
  const before = (await popup.boundingBox())!;
  const handle = (await resizer.boundingBox())!;

  await page.mouse.move(handle.x + handle.width / 2, handle.y + 100);
  await page.mouse.down();
  await page.mouse.move(handle.x + handle.width / 2 + 60, handle.y + 100);
  await page.mouse.up();

  const after = (await popup.boundingBox())!;
  expect(after.width).toBeGreaterThan(before.width);
  expect(after.width).toBeLessThanOrEqual(DESKTOP_VIEWPORT.width - 32);
});
