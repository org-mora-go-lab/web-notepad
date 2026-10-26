import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";

test("1. 내가 공유한 그룹은 My Group, 받은 그룹은 Share Group에 표시한다", async ({ sharing: { owner, guest, id } }) => {
 await expect(owner.locator('#group-my-list [data-group-id="'+id+'"]')).toBeVisible();
 await expect(owner.locator('#group-shared-list [data-group-id="'+id+'"]')).toHaveCount(0);
 await expect(guest.locator('#group-shared-list [data-group-id="'+id+'"]')).toBeVisible();
 await expect(guest.locator('#group-my-list [data-group-id="'+id+'"]')).toHaveCount(0);
});
