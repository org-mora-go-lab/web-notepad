import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import {
  groupsCommand,
  groupStatusName,
  moreCommand,
  openHeaderMenu,
  openSettingsPanel,
  readStoredState,
} from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("4. 선택한 언어를 메뉴·패널·하단 메뉴·편집기 안내 문구에 즉시 적용한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const panel = settingsPanel(page);
  const headings = panel.locator(".setting-section h3");

  await languageRadio(page, "한국어").check();
  await expect(panel.locator("h2")).toHaveText("설정");
  await expect(headings).toHaveText([
    "테마",
    "전체 폰트 크기",
    "탭 색상",
    "언어",
    "패널 슬라이드 효과",
    "패널 위치",
    "데이터",
  ]);
  await expect(panel.locator(".setting-hint")).toContainText("새 탭은 첫 번째 색상으로 시작합니다.그레이 → 인디고 → 틸");
  await expect(moreCommand(page).locator(".status-label")).toHaveText("더보기");
  await expect(page.locator(".more-command")).toHaveAccessibleName("더보기");
  await expect(page.locator(".note-area")).toHaveAttribute("placeholder", "메모를 입력하세요..");

  await page.getByRole("button", { name: "설정 닫기" }).click();
  const tools = await openHeaderMenu(page);
  await expect(tools.getByRole("button", { name: "검색" })).toBeVisible();
  await expect(tools.getByRole("button", { name: "설정" })).toHaveCount(0);
  await expect(tools.getByRole("button", { name: "닫은 탭" })).toHaveCount(0);
  await page.keyboard.press("Escape");

  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    await groupsCommand(page).click();
    await expect(page.getByRole("button", { name: "미지정 그룹", exact: true })).toBeVisible();
    await page.getByRole("button", { name: "모든 그룹", exact: true }).click();
    await expect(groupStatusName(page)).toHaveText("모든 그룹");
    if (viewport.width <= 512) await groupsCommand(page).click();
    await page.getByRole("button", { name: "미지정 그룹", exact: true }).click();
    await expect(groupStatusName(page)).toHaveText("미지정 그룹");
    if (viewport.width > 512) await page.keyboard.press("Escape");
  }
  expect((await readStoredState(page)).groups.find((group) => group.id === "ungrouped")!.name).toBe("Ungrouped");

  await openSettingsPanel(page);
  await languageRadio(page, "English").check();
  await expect(panel.locator("h2")).toHaveText("Settings");
  await expect(moreCommand(page).locator(".status-label")).toHaveText("MORE");
  await expect(groupStatusName(page)).toHaveText("Ungrouped");
  await page.getByRole("button", { name: "Close Settings" }).click();
  await groupsCommand(page).click();
  await expect(page.getByRole("button", { name: "All Group", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Ungrouped", exact: true })).toBeVisible();
});
