import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openGlobalSearchPanel, seedStoredStateOnLoad } from "../../__util__";
import { createGlobalSearchState } from "./__fixture__";

test("8. PC 검색 팝업과 내부 좌우 영역의 가로 크기를 조절한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await seedStoredStateOnLoad(page, createGlobalSearchState());
  await openGlobalSearchPanel(page);
  await page.getByRole("searchbox").fill("Work");
  await page.getByRole("button", { name: "Preview bookmark Work plan", exact: true }).click();
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

  const splitResizer = popup.getByRole("separator", {
    name: "Resize search results and preview",
  });
  const results = popup.locator(".global-search-results-pane");
  const resultsBefore = (await results.boundingBox())!;
  const splitHandle = (await splitResizer.boundingBox())!;
  await page.mouse.move(
    splitHandle.x + splitHandle.width / 2,
    splitHandle.y + 100,
  );
  await page.mouse.down();
  await page.mouse.move(
    splitHandle.x + splitHandle.width / 2 + 80,
    splitHandle.y + 100,
  );
  await page.mouse.up();
  expect((await results.boundingBox())!.width).toBeGreaterThan(
    resultsBefore.width,
  );
});
