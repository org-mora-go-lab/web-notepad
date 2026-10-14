import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { writeStoredState } from "../../__util__";

test("3. 모바일의 긴 그룹명은 17px 한 줄 말줄임과 전체 이름 툴팁·접근성 라벨로 표시한다", async ({
  page,
}) => {
  const longName = "Very long group name for mobile current group layout that is clipped";
  await writeStoredState(page, {
    activeGroupId: "work",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]),
      createGroupFixture("work", longName, [createTabFixture("tab-2", "Work note")]),
    ],
    nextTabNumber: 3,
  });
  const panel = page.locator(".group-select-command");
  const name = panel.locator(".group-select-name");

  await page.setViewportSize({ width: 320, height: 844 });
  await expect(name).toHaveText(longName);
  await expect(name).toHaveAttribute("title", longName);
  await expect(panel).toHaveAttribute("aria-label", `Select group: ${longName}`);
  await expect(name).toHaveCSS("text-overflow", "ellipsis");
  await expect(name).toHaveCSS("white-space", "nowrap");
  expect(await name.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);

  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(name).toHaveCSS("font-size", "17px");
    const panelBounds = (await panel.boundingBox())!;
    const nameBounds = (await name.boundingBox())!;
    expect(nameBounds.x + nameBounds.width).toBeLessThanOrEqual(panelBounds.x + panelBounds.width);
    expect(panelBounds.x).toBeCloseTo(21, 1);
    const dashboardBounds = (await page.locator(".dashboard-command").boundingBox())!;
    expect(panelBounds.x + panelBounds.width).toBeLessThanOrEqual(dashboardBounds.x);
  }
});
