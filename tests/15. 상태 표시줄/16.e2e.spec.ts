import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../__fixture__";
import { switchGroup, writeStoredState } from "../__util__";

test("16. 모바일 그룹명은 17px로 두 줄까지 줄바꿈 후 말줄임하고 두 줄은 중앙, 한 줄은 중앙보다 3px 위에 표시하며 그룹 전환과 새로고침 후 동기화한다", async ({
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
  // Name center minus button center; negative means above center.
  const centerOffset = async () => {
    const nameBounds = (await name.boundingBox())!;
    const buttonBounds = (await panel.boundingBox())!;
    return nameBounds.y + nameBounds.height / 2 - (buttonBounds.y + buttonBounds.height / 2);
  };

  // At 390px "Ungrouped" fits on one line (at 320px it wraps).
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(name).toHaveText("Ungrouped");
  await expect(name).not.toHaveClass(/is-multiline/);
  await expect.poll(centerOffset).toBeCloseTo(-3, 0);
  await page.setViewportSize({ width: 320, height: 844 });
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
    await expect(name).toHaveCSS("font-size", "17px");
    await expect(name).toHaveCSS("line-height", "20px");
    const nameBounds = (await name.boundingBox())!;
    expect(nameBounds.x).toBeCloseTo(16, 1);
    expect(nameBounds.height).toBeCloseTo(40, 0);
    expect(nameBounds.x + nameBounds.width).toBeLessThanOrEqual((await panel.boundingBox())!.x + (await panel.boundingBox())!.width);
    await expect(name).toHaveClass(/is-multiline/);
    expect(await centerOffset()).toBeCloseTo(0, 0);
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(name).toHaveText(longName);
  await switchGroup(page, "Ungrouped");
  await expect(name).toHaveText("Ungrouped");
  await expect(name).not.toHaveClass(/is-multiline/);
  await expect.poll(centerOffset).toBeCloseTo(-3, 0);
});
