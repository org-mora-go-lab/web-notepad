import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import { dashboardPanel } from "../../__util__";

test("6. PC 대시보드를 페이지 전체 영역으로 확장하고 기존 크기로 축소한다", async ({
  page,
}) => {
  await page.goto("/");
  await openPanel(page, "dashboard-panel");

  const panel = dashboardPanel(page);
  const expand = panel.getByRole("button", { name: "Expand dashboard" });
  const pin = panel.locator(".dashboard-options-trigger");
  const expandBounds = (await expand.boundingBox())!;
  const pinBounds = (await pin.boundingBox())!;
  expect(expandBounds.x + expandBounds.width).toBeLessThanOrEqual(pinBounds.x);

  await expand.click();
  await expect(panel.getByRole("button", { name: "Collapse dashboard" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  const expandedBounds = (await panel.boundingBox())!;
  expect(expandedBounds.x).toBe(0);
  expect(expandedBounds.y).toBe(0);
  expect(expandedBounds.width).toBe(page.viewportSize()!.width);
  expect(expandedBounds.height).toBe(page.viewportSize()!.height);
  expect(await page.evaluate(() => document.fullscreenElement)).toBeNull();

  await panel.getByRole("button", { name: "Collapse dashboard" }).click();
  await expect(panel).not.toHaveCSS("width", `${page.viewportSize()!.width}px`);
});
