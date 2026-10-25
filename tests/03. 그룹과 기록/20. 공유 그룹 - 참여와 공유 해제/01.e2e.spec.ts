import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("1. 주최자의 두 그룹 메뉴는 공유 취소를 제공한다", async ({ sharing: { owner, id } }) => {
  for (const method of ["context", "button"] as const) {
    const menu = await openSharingMenu(owner, id, method);
    await expect(menu.getByRole("button", { name: "Cancel group sharing", exact: true })).toBeVisible();
    await expect(menu.getByRole("button", { name: "Leave group", exact: true })).toHaveCount(0);
    await owner.keyboard.press("Escape");
  }
});
