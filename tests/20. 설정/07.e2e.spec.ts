import { expect, test } from "@playwright/test";

import { bookmarksCommand, openSettingsPanel } from "../__util__";
import { languageRadio, settingsPanel } from "./__util__";

test("7. Tab Colors 아래 Language에서 English·한국어를 선택하며 기본값은 English이고 선택 즉시 화면 문구에 적용한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);

  const headings = panel.locator(".setting-section h3");
  await expect(headings).toHaveText(["Font Size", "Tab Colors", "Language", "Panel Slide", "Panel Position"]);
  await expect(languageRadio(page, "English")).toBeChecked();
  await expect(languageRadio(page, "한국어")).not.toBeChecked();

  await languageRadio(page, "한국어").check();
  await expect(panel.locator("h2")).toHaveText("설정");
  await expect(headings).toHaveText(["전체 폰트 크기", "탭 색상", "언어", "패널 슬라이드 효과", "패널 위치"]);
  await expect(panel.locator(".setting-hint")).toContainText("새 탭은 첫 번째 색상으로 시작합니다.그레이 → 그린 → 퍼플");
  await expect(bookmarksCommand(page).locator(".status-label")).toHaveText("북마크");
  await expect(page.locator(".global-search-command")).toContainText("검색");
  await expect(page.locator(".note-area")).toHaveAttribute("placeholder", "메모를 입력하세요..");
  await expect(languageRadio(page, "English")).toBeVisible();

  await page.getByRole("button", { name: "설정 닫기" }).click();
  await page.getByRole("button", { name: "MENU", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "설정" })).toContainText("설정");
  await expect(page.getByRole("menuitem", { name: "닫은 탭" })).toContainText("닫은 탭");
  await page.keyboard.press("Escape");

  await openSettingsPanel(page);
  await languageRadio(page, "English").check();
  await expect(panel.locator("h2")).toHaveText("Settings");
  await expect(bookmarksCommand(page).locator(".status-label")).toHaveText("BOOKMARK");
});
