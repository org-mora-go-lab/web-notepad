import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

const KOREAN_COLORS = ["그레이", "레드", "오렌지", "옐로", "그린", "틸", "인디고", "퍼플", "핑크"];

test("9. 탭 색상 이름과 문구를 선택 언어로 표시하고 선택 행 앞에 순번을 표시하지 않는다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  await languageRadio(page, "한국어").check();

  await expect(panel.getByRole("heading", { name: "탭 색상" })).toBeVisible();
  for (const order of [1, 2, 3]) {
    const group = panel.getByRole("radiogroup", { name: `탭 색상 ${order}` });
    expect(await group.getByRole("radio").evaluateAll(
      items => items.map(item => item.getAttribute("aria-label")),
    )).toEqual(KOREAN_COLORS);
    await expect(group.locator("xpath=..")).toHaveText("");
  }
  await expect(panel.locator(".setting-hint")).toHaveText(
    "새 탭은 첫 번째 색상으로 시작합니다.그레이 → 그린 → 퍼플",
  );
});
