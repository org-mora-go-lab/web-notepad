import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand } from "../../__util__";
test("3. 접기 상태를 사이드바 재진입과 새로고침 뒤에도 유지한다", async ({ sharing: { guest } }) => {
 await guest.getByRole('button',{name:'Shared Group',exact:true}).click();
 await guest.keyboard.press('Escape'); await groupsCommand(guest).click();
 await expect(guest.getByRole('button',{name:'Shared Group',exact:true})).toHaveAttribute('aria-expanded','false');
 await guest.reload(); await expect(guest.locator('button.auth-command')).toBeVisible(); if(await groupsCommand(guest).getAttribute('aria-expanded')!=='true') await groupsCommand(guest).click();
 await expect(guest.getByRole('button',{name:'Shared Group',exact:true})).toHaveAttribute('aria-expanded','false');
});
