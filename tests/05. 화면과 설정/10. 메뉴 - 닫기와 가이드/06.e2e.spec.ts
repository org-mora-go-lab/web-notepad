import { expect, test } from "@playwright/test";

import { openSettingsPanel } from "../../__util__";
import { languageRadio, settingsPanel } from "../__util__";

test("6. 한국어 사용 가이드는 이전·다음으로 이동하고 10단계의 닫기로 종료한다", async ({ page }) => {
  await page.goto("/");
  await openSettingsPanel(page);
  const settings = settingsPanel(page);
  await languageRadio(page, "한국어").check();
  await settings.getByRole("button", { name: "설정 닫기", exact: true }).click();
  await page.getByRole("button", { name: "메뉴", exact: true }).click();
  await page.getByRole("menuitem", { name: "사용 가이드", exact: true }).click();
  const guide = page.getByRole("dialog");
  const progress = guide.locator(".user-guide-progress");
  const next = guide.getByRole("button", { name: "다음", exact: true });
  await next.click();
  await expect(progress).toHaveText("2 / 10");
  await guide.getByRole("button", { name: "이전", exact: true }).click();
  await expect(progress).toHaveText("1 / 10");
  for (let step = 2; step <= 10; step += 1) await next.click();
  const close = guide.getByRole("button", { name: "닫기", exact: true });
  await expect(close).toBeVisible();
  await close.click();
  await expect(guide).toHaveCount(0);
});
