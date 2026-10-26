import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
test("1. 계정 메뉴에서 My Page로 이동해 프로필과 내 공유 현황을 보여준다", async ({ sharing: { owner, guest } }) => {
 await owner.keyboard.press('Escape'); await owner.locator('button.auth-command').click();
 await owner.getByRole('menuitem',{name:'My Page',exact:true}).click(); await expect(owner).toHaveURL(/\/my-page$/);
 await expect(owner.getByRole('heading',{name:'Owner',exact:true})).toBeVisible();
 await expect(owner.locator('[data-metric="shared-by-me"] dd')).toHaveText('1');
 await expect(owner.locator('[data-metric="joined"] dd')).toHaveText('0');
 await guest.goto('/my-page'); await expect(guest.locator('[data-metric="joined"] dd')).toHaveText('1');
 await expect(guest.locator('[data-metric="notes"] dd')).toHaveText('1');
});
