import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import {
  dragPanelEdgeTo,
  workspaceBounds,
} from "../../04. 패널과 검색/__util__";

test("5. PC 메뉴나 대시보드가 작업 영역을 좁혀도 푸터 라벨을 유지한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/");
  await openPanel(page, "dashboard-panel");
  await dragPanelEdgeTo(page, "dashboard-panel", 120);
  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBeLessThanOrEqual(512);

  const footer = page.locator(".footer");
  await expect
    .poll(() => footer.evaluate((bar) => bar.scrollWidth <= bar.clientWidth))
    .toBe(true);
  const footerBox = (await footer.boundingBox())!;
  const accountBox = (await footer.locator(".auth-command").boundingBox())!;
  expect(accountBox.x + accountBox.width).toBeLessThanOrEqual(
    footerBox.x + footerBox.width,
  );
  const commands = footer.locator(".status-command");
  await expect(footer.locator(".current-group-panel")).toBeHidden();
  await expect(footer.locator(".group-current-value")).toBeHidden();
  await expect(footer.locator(".group-command-label")).toBeVisible();
  await expect(
    footer.locator(".dashboard-command > .status-label"),
  ).toBeVisible();
  for (const command of await commands.all())
    expect((await command.boundingBox())!.height).toBeCloseTo(35, 1);

  await dragPanelEdgeTo(page, "dashboard-panel", 700);
  await expect
    .poll(async () => (await workspaceBounds(page)).width)
    .toBeGreaterThan(512);
  await expect(footer.locator(".current-group-panel")).toBeHidden();
  await expect(footer.locator(".group-current-value")).toBeHidden();
  await expect(footer.locator(".group-command-label")).toBeVisible();
  await expect(
    footer.locator(".dashboard-command > .status-label"),
  ).toBeVisible();
  for (const command of await commands.all())
    expect((await command.boundingBox())!.height).toBeCloseTo(35, 1);
});
