import { expect, test } from "@playwright/test";

import { deleteTabPopup } from "../../__util__";
import { requestInactiveTabDelete } from "../02. 탭 - 닫기/__util__";

test("7. 탭 삭제 팝업은 닫기 단축키의 자동 반복 입력을 무시한다", async ({ page }) => {
  await page.goto("/");
  await requestInactiveTabDelete(page);
  const popup = deleteTabPopup(page);

  await popup.dispatchEvent("keydown", {
    key: "Backspace",
    code: "Backspace",
    altKey: true,
    repeat: true,
  });

  await expect(popup).toBeVisible();
  await expect(page.locator(".tab-item")).toHaveCount(2);
  await popup.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator("textarea")).toHaveValue("Keep the active note");
});
