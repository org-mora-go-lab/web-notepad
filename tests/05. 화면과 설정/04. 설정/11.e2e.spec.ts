import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { fontScaleRadio, settingsPanel } from "./__util__";

const TAB_COLORS = ["gray", "red", "orange", "yellow", "green", "teal", "indigo", "purple", "pink"];

test("11. 색상 초기화 버튼 오른쪽의 셔플 버튼은 팝업 없이 서로 다른 3가지 색상을 무작위로 골라 순서를 바꾼다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const reset = panel.getByRole("button", { name: "탭 색상 초기화", exact: true });
  const shuffle = panel.getByRole("button", { name: "탭 색상 무작위 선택", exact: true });
  const resetBounds = (await reset.boundingBox())!;
  const shuffleBounds = (await shuffle.boundingBox())!;
  expect(shuffleBounds.x).toBeGreaterThanOrEqual(resetBounds.x + resetBounds.width);
  expect(shuffleBounds.y).toBeCloseTo(resetBounds.y, 0);

  await fontScaleRadio(page, "90%").check();
  const readSettings = () =>
    page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings, STORAGE_KEY);

  let previous: string[] = ["gray", "green", "purple"];
  for (let round = 0; round < 5; round += 1) {
    await shuffle.click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await expect.poll(async () => (await readSettings()).tabColorCycle).not.toEqual(previous);
    const settings = await readSettings();
    const cycle: string[] = settings.tabColorCycle;
    expect(cycle).toHaveLength(3);
    expect(new Set(cycle).size).toBe(3);
    for (const color of cycle) expect(TAB_COLORS).toContain(color);
    expect(settings.fontScale).toBe(0.9);
    expect(settings.language).toBe("en");
    for (const [index, color] of cycle.entries()) {
      await expect(
        panel.getByRole("radiogroup", { name: `Tab color ${index + 1}` }).locator(`[data-tab-color="${color}"]`),
      ).toBeChecked();
    }
    previous = cycle;
  }
});
