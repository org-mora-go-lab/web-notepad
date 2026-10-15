import { expect, test } from "@playwright/test";

import { STORAGE_KEY } from "../../__constant__";
import { openSettingsPanel } from "../../__util__";
import { settingsPanel, tabColorRadio } from "../__util__";

test("3. Tab Colors 제목 오른쪽의 색상 초기화 버튼은 팝업 없이 탭 색상 순서만 기본값으로 되돌린다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await expect(panel).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const title = panel.locator(".setting-section-heading h3", { hasText: "Tab Colors" });
  const reset = panel.getByRole("button", { name: "Reset tab colors", exact: true });
  const titleBounds = (await title.boundingBox())!;
  const resetBounds = (await reset.boundingBox())!;
  expect(resetBounds.x).toBeGreaterThanOrEqual(titleBounds.x + titleBounds.width);
  expect(resetBounds.y + resetBounds.height / 2).toBeCloseTo(titleBounds.y + titleBounds.height / 2, 0);

  await tabColorRadio(page, 1, "Pink").check();
  await tabColorRadio(page, 3, "Teal").check();

  await reset.click();
  await expect(page.getByRole("alertdialog")).toHaveCount(0);
  await expect(tabColorRadio(page, 1, "Orange")).toBeChecked();
  await expect(tabColorRadio(page, 2, "Green")).toBeChecked();
  await expect(tabColorRadio(page, 3, "Red")).toBeChecked();
  await expect
    .poll(() => page.evaluate((key) => JSON.parse(localStorage.getItem(key)!).state.settings, STORAGE_KEY))
    .toMatchObject({ tabColorCycle: ["orange", "green", "red"] });
});
