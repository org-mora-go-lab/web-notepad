import { expect, test } from "@playwright/test";

import { bookmarksCommand, openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("9. 선택한 언어를 메뉴·패널·하단 메뉴·편집기 안내 문구에 즉시 적용한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const headings = panel.locator(".setting-section h3");

  await languageRadio(page, "한국어").check();
  await expect(panel.locator("h2")).toHaveText("설정");
  await expect(headings).toHaveText(["전체 폰트 크기", "탭 색상", "언어", "패널 슬라이드 효과", "패널 위치"]);
  await expect(panel.locator(".setting-hint")).toContainText("새 탭은 첫 번째 색상으로 시작합니다.그레이 → 그린 → 퍼플");
  await expect(bookmarksCommand(page).locator(".status-label")).toHaveText("북마크");
  await expect(page.locator(".global-search-command")).toContainText("검색");
  await expect(page.locator(".note-area")).toHaveAttribute("placeholder", "메모를 입력하세요..");

  await page.getByRole("button", { name: "설정 닫기" }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await expect(page.getByRole("menuitem", { name: "설정" })).toContainText("설정");
  await expect(page.getByRole("menuitem", { name: "닫은 탭" })).toContainText("닫은 탭");
  await page.keyboard.press("Escape");

  await openSettingsPanel(page);
  await languageRadio(page, "English").check();
  await expect(panel.locator("h2")).toHaveText("Settings");
  await expect(bookmarksCommand(page).locator(".status-label")).toHaveText("BOOKMARK");
});
