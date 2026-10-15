import { expect, test } from "@playwright/test";

import { openPanel } from "../../__util__";
import {
  dragPanelEdgeTo,
  panelPinButton,
  workspaceBounds,
} from "../../04. 패널과 검색/__util__";

test("5. 넓은 고정 패널로 작업 영역이 좁아지면 푸터를 모바일 아이콘 구성으로 전환한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto("/");
  await openPanel(page, "bookmarks-panel");
  await panelPinButton(page, "bookmarks-panel").click();
  await dragPanelEdgeTo(page, "bookmarks-panel", 250);
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeLessThanOrEqual(640);

  const footer = page.locator(".footer");
  const commands = footer.locator(".status-command");
  await expect(footer.locator(".current-group-panel")).toBeVisible();
  for (const command of await commands.all())
    expect((await command.boundingBox())!.height).toBeCloseTo(61.2, 1);
  const centers = await Promise.all(
    (await commands.all()).map(async (command) => {
      const bounds = (await command.boundingBox())!;
      return bounds.x + bounds.width / 2;
    }),
  );
  const sortedCenters = centers.sort((left, right) => left - right);
  const gaps = sortedCenters
    .slice(1)
    .map((center, index) => center - sortedCenters[index]);
  expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThanOrEqual(1);

  await dragPanelEdgeTo(page, "bookmarks-panel", 700);
  await expect.poll(async () => (await workspaceBounds(page)).width).toBeGreaterThan(640);
  await expect(footer.locator(".current-group-panel")).toBeHidden();
  for (const command of await commands.all())
    expect((await command.boundingBox())!.height).toBeCloseTo(35, 1);
});
