import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("8. 공유 취소 확인창을 취소하면 참여 권한과 초대 링크를 유지한다", async ({ sharing: { owner, guest, id, token } }) => {
  const menu = await openSharingMenu(owner, id); await menu.getByRole("button", { name: "Cancel group sharing", exact: true }).click();
  await owner.getByRole("alertdialog", { name: "Cancel group sharing", exact: true }).getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await guest.request.post("/api/groups/join", { data: { token } })).ok()).toBe(true);
  expect((await (await guest.request.get("/api/groups")).json()).groups[0].id).toBe(id);
});
