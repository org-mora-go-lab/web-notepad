import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { switchGroup, writeStoredState } from "../__util__";

test("10. 모바일 그룹명은 두 줄까지 줄바꿈 후 말줄임하고 그룹 전환과 새로고침 후 동기화한다", async ({
  page,
}) => {
  const longName = "Very long group name for mobile current group layout that wraps to two lines";
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", ""),
      ]),
      createGroupFixture("work", longName, [
        createTabFixture("tab-2", "Work note"),
      ]),
    ],
    nextTabNumber: 3,
  });
  const panel = page.locator(".group-status-command");
  const name = panel.locator(".group-status-name");

  await page.setViewportSize({ width: 320, height: 844 });
  await expect(name).toHaveText("Ungrouped");
  await switchGroup(page, longName);
  await expect(name).toHaveText(longName);
  await expect(name).toHaveAttribute("title", longName);
  await expect(panel).toHaveAttribute("aria-label", `그룹 선택: ${longName}`);
  await expect(name).toHaveCSS("text-overflow", "ellipsis");
  await expect(name).toHaveCSS("white-space", "normal");
  await expect(name).toHaveCSS("-webkit-line-clamp", "2");
  expect(
    await name.evaluate((element) => element.scrollHeight > element.clientHeight),
  ).toBe(true);

  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(name).toHaveCSS("font-size", "15px");
    await expect(name).toHaveCSS("line-height", "18px");
    const nameBounds = (await name.boundingBox())!;
    const searchLabelBounds = (await page.locator(".global-search-command .global-search-label").boundingBox())!;
    expect(nameBounds.x).toBeCloseTo(16, 1);
    expect(nameBounds.height).toBeCloseTo(36, 0);
    expect(nameBounds.x + nameBounds.width).toBeLessThan(searchLabelBounds.x);
  }

  await page.reload();
  await expect(name).toHaveText(longName);
  await switchGroup(page, "Ungrouped");
  await expect(name).toHaveText("Ungrouped");
});
