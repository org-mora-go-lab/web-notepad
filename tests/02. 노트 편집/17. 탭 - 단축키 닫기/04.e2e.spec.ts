import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../../__util__";
import { requestInactiveTabDelete } from "../02. 탭 - 닫기/__util__";

test("4. 확인 중인 탭이 비활성화돼도 같은 단축키는 요청한 탭만 삭제한다", async ({ page }) => {
  await page.goto("/");
  await requestInactiveTabDelete(page);
  const tabs = page.locator(".tab-item");
  const editor = page.locator("textarea");

  await page.keyboard.press("Alt+Backspace");
  await expect(deleteTabPopup(page)).toHaveCount(0);
  await expect(tabs).toHaveCount(1);
  await expect(editor).toHaveValue("Keep the active note");
});
