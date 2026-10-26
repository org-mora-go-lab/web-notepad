import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";

test("2. 두 영역을 독립적으로 접고 펼치며 선택한 노트를 보존한다", async ({ sharing: { guest, id } }) => {
 const my=guest.getByRole('button',{name:'My Group',exact:true}); const shared=guest.getByRole('button',{name:'Share Group',exact:true});
 await my.focus(); await my.press('Enter'); await expect(my).toHaveAttribute('aria-expanded','false');
 await expect(shared).toHaveAttribute('aria-expanded','true');
 await shared.click(); await expect(guest.locator('[data-group-id="'+id+'"]')).toBeHidden();
 await expect(guest.locator('textarea').first()).toHaveValue('Keep this note');
 await shared.click(); await expect(guest.locator('[data-group-id="'+id+'"]')).toBeVisible();
});
