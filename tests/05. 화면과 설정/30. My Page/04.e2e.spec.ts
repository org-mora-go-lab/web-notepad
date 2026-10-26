import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
test("4. 계정 로딩 실패 뒤 다시 시도하면 프로필과 통계를 복구한다", async ({ page, context }) => {
 await authenticateBrowser(context,signedSession({id:'my-retry-'+crypto.randomUUID(),nickname:'Retry user',expiresAt:Date.now()+300000}));
 await page.route('**/api/auth/session',route=>route.fulfill({status:503,json:{error:'offline'}}));
 await page.goto('/my-page'); await expect(page.locator('.my-page-notice[role=alert]')).toBeVisible();
 await page.unroute('**/api/auth/session'); await page.locator('.my-page-notice[role=alert]').getByRole('button').click();
 await expect(page.getByRole('heading',{name:'Retry user',exact:true})).toBeVisible();
 await expect(page.locator('.my-page-metrics')).toBeVisible();
});
