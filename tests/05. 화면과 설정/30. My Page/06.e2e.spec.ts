import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
test("6. My Page에서 Logout 후 홈으로 돌아가고 로컬 노트를 보존한다", async ({ page, context }) => {
 await authenticateBrowser(context,signedSession({id:'my-logout-'+crypto.randomUUID(),nickname:'Logout user',expiresAt:Date.now()+300000}));
 await page.goto('/'); await expect(page.locator('button.auth-command')).toBeVisible(); await page.locator('textarea').first().fill('Keep my local note');
 await page.locator('button.auth-command').click(); await page.getByRole('menuitem',{name:'My Page',exact:true}).click();
 await page.getByRole('button',{name:'Logout',exact:true}).click(); await expect(page).toHaveURL(/\/$/);
 await expect(page.locator('textarea').first()).toHaveValue('Keep my local note');
 expect((await page.request.get('/api/auth/session')).ok()).toBe(true);
 expect((await (await page.request.get('/api/auth/session')).json()).user).toBeNull();
});
