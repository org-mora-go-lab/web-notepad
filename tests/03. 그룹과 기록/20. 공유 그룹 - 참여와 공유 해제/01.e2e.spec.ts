import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("1. 공유 중인 주최자 메뉴는 공유하기 위치를 공유 취소 아이콘과 명칭으로 대체한다", async ({ sharing: { owner, id } }) => {
  for (const language of ["en", "ko"] as const) {
    if (language === "ko") {
      await owner.evaluate(() => { const key = "web-notepad-storage"; const data = JSON.parse(localStorage.getItem(key)!); data.state.settings.language = "ko"; localStorage.setItem(key, JSON.stringify(data)); });
      await owner.reload();
      await expect(owner.locator("button.auth-command")).toBeVisible();
    }
    for (const method of ["context", "button"] as const) {
      const menu = await openSharingMenu(owner, id, method);
      const cancel = menu.getByRole("button", { name: language === "en" ? "Cancel Sharing" : "공유 취소", exact: true });
      await expect(cancel).toBeVisible(); await expect(cancel.locator("svg")).toHaveClass(/lucide-unlink/);
      await expect(menu.getByRole("button").nth(1)).toHaveText(language === "en" ? "Cancel Sharing" : "공유 취소");
      await expect(menu.getByRole("button", { name: /Share Shared team group|Shared team 그룹 공유하기|Leave group|그룹 나가기/ })).toHaveCount(0);
      await owner.keyboard.press("Escape");
    }
  }
});
