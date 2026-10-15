import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { openClosedPanel } from "../../__util__";
import { seedClosedPanelState } from "./__fixture__";

test("6. Closed 팝업과 내부 좌우 영역의 너비를 조절한다", async ({ page }) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await seedClosedPanelState(page, 20);
  await openClosedPanel(page);

  const popup = page.locator("#closed-popup");
  const bounds = (await popup.boundingBox())!;
  expect(bounds.width).toBeCloseTo(912, 0);
  expect(bounds.height).toBeCloseTo(640, 0);
  expect(bounds.x).toBeCloseTo((DESKTOP_VIEWPORT.width - bounds.width) / 2, 0);
  expect(bounds.y).toBeCloseTo((DESKTOP_VIEWPORT.height - bounds.height) / 2, 0);

  const popupResizer = popup.getByRole("separator", {
    name: "Resize closed popup",
  });
  const popupHandle = (await popupResizer.boundingBox())!;
  await page.mouse.move(
    popupHandle.x + popupHandle.width / 2,
    popupHandle.y + 100,
  );
  await page.mouse.down();
  await page.mouse.move(
    popupHandle.x + popupHandle.width / 2 + 60,
    popupHandle.y + 100,
  );
  await page.mouse.up();
  const resizedBounds = (await popup.boundingBox())!;
  expect(resizedBounds.width).toBeGreaterThan(bounds.width);
  expect(resizedBounds.width).toBeLessThanOrEqual(DESKTOP_VIEWPORT.width - 32);

  const list = popup.locator(".closed-list");
  await list.evaluate((element) => element.scrollTo(0, 120));
  await expect(popup.locator(".closed-results-pane")).toHaveClass(/is-scrolled/);
  const searchBox = (await popup.locator(".search-field").boundingBox())!;
  const itemBox = (await popup.locator(".closed-item").first().boundingBox())!;
  expect(searchBox.x + searchBox.width).toBeCloseTo(itemBox.x + itemBox.width, 0);
  await expect
    .poll(() =>
      popup.locator(".closed-results-pane").evaluate((element) =>
        getComputedStyle(element, "::after").opacity,
      ),
    )
    .toBe("1");

  const results = popup.locator(".closed-results-pane");
  const resultsBefore = (await results.boundingBox())!;
  const splitResizer = popup.getByRole("separator", {
    name: "Resize closed list and preview",
  });
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

  await page.keyboard.press("Escape");
  await expect(popup).not.toHaveAttribute("open", "");

  await openClosedPanel(page);
  await page.mouse.click(4, 4);
  await expect(popup).not.toHaveAttribute("open", "");
});
