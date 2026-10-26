import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { addTabButton, openMoreMenu } from "../../__util__";
test("10. Alarm 항목을 클릭하면 변경된 그룹과 해당 탭을 연다", async ({sharing:{owner,guest}})=>{
 await guest.keyboard.press('Escape'); await addTabButton(guest).click();
 const saved=guest.waitForResponse(r=>r.url().endsWith('/api/groups/update')&&r.request().method()==='POST');
 await guest.locator('textarea').first().fill('Alarm target second tab'); await saved;
 await owner.locator('.group-system-list').getByRole('button',{name:'Ungrouped',exact:true}).click(); await owner.keyboard.press('Escape');
 await owner.reload(); await expect(owner.locator('button.auth-command')).toBeVisible();
 const menu=await openMoreMenu(owner); await menu.getByRole('button',{name:/^Alarm/}).click();
 const entry=owner.locator('.notification-entry').filter({hasText:'Guest'}).first(); await expect(entry).toBeVisible(); await entry.click();
 await expect(owner.locator('.footer-notifications-panel')).toHaveCount(0);
 await expect(owner.locator('.tab-item.is-active .tab-title')).toHaveText('Alarm target second tab');
 await expect(owner.locator('textarea').first()).toHaveValue('Alarm target second tab');
});
