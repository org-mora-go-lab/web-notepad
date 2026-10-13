import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../__constant__";
import { createGroupFixture, createTabFixture } from "../__fixture__";
import { writeStoredState } from "../__util__";

test("15. 모바일 그룹명을 하단 버튼에 통합하고 편집기가 하단 메뉴 바로 위까지 채운다", async ({
  page,
}) => {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", ""),
      ]),
    ],
    nextTabNumber: 2,
  });
  const panel = page.locator(".group-status-command");
  const name = panel.locator(".group-status-name");
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await expect(panel).toBeHidden();
  await expect(page.locator(".current-group-panel")).toHaveCount(0);

  await page.setViewportSize({ width: 320, height: 844 });
  await expect(panel).toBeVisible();
  await expect(name).toHaveText("Ungrouped");
  await expect(panel.locator("svg")).toHaveCount(0);
  await expect(page.locator(".current-group-panel")).toHaveCount(0);

  for (const width of [320, 390, 640]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(panel).toBeInViewport();
    await expect(page.locator(".group-select-command svg")).toHaveCSS("width", "24px");
    await expect(page.locator(".group-select-command svg")).toHaveCSS("height", "24px");
    const panelBounds = (await panel.boundingBox())!;
    const footerBounds = (await page.locator(".footer").boundingBox())!;
    const editorBounds = (await page.locator(".pane-group").boundingBox())!;
    expect(panelBounds.height).toBe(51);
    expect(panelBounds.width).toBeCloseTo(width - 72 * 2, 1);
    expect(footerBounds.height).toBe(64);
    expect(editorBounds.y).toBe(0);
    expect(editorBounds.y + editorBounds.height).toBe(footerBounds.y);
    expect(editorBounds.height).toBe(844 - footerBounds.height);
    expect(
      await page.locator(".footer").evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  }
});
