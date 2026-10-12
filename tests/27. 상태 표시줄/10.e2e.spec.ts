import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { createGroupFixture, createTabFixture } from "../__fixture__";
import { switchGroup, writeStoredState } from "../__util__";

test("10. 모바일 그룹명을 하단 버튼에 통합하고 편집기 공간과 그룹 동기화를 유지한다", async ({
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
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(name).toBeVisible();
  await expect(page.locator(".current-group-panel")).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 844 });
  await expect(panel).toBeVisible();
  await expect(name).toHaveText("Ungrouped");
  await expect(panel.locator("svg")).toHaveCount(0);
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
    await expect(panel).toBeInViewport();
    await expect(name).toHaveCSS("font-size", "15px");
    await expect(name).toHaveCSS("line-height", "18px");
    await expect(page.locator(".group-select-command svg")).toHaveCSS("width", "24px");
    await expect(page.locator(".group-select-command svg")).toHaveCSS("height", "24px");
    const panelBounds = (await panel.boundingBox())!;
    const nameBounds = (await name.boundingBox())!;
    const searchLabelBounds = (await page.locator(".global-search-command .global-search-label").boundingBox())!;
    const footerBounds = (await page.locator(".footer").boundingBox())!;
    const editorBounds = (await page.locator(".pane-group").boundingBox())!;
    expect(panelBounds.height).toBe(51);
    expect(panelBounds.width).toBeCloseTo(width - 72 * 3, 1);
    expect(nameBounds.x).toBeCloseTo(16, 1);
    expect(nameBounds.height).toBeCloseTo(36, 0);
    expect(nameBounds.x + nameBounds.width).toBeLessThan(searchLabelBounds.x);
    expect(editorBounds.y).toBe(0);
    expect(editorBounds.y + editorBounds.height).toBe(footerBounds.y);
    expect(editorBounds.height).toBe(844 - footerBounds.height);
    expect(
      await page.locator(".footer").evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }

  await page.reload();
  await expect(name).toHaveText(longName);
  await switchGroup(page, "Ungrouped");
  await expect(name).toHaveText("Ungrouped");
});
