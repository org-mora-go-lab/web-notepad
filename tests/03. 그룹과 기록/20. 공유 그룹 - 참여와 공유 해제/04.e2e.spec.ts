import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("4. 공유 취소는 기존 참여자와 초대 링크 및 게시판 접근을 해제하고 원문을 지킨다", async ({ sharing: { owner, guest, id, token, url } }) => {
  expect((await (await owner.request.get("/api/board")).json()).posts.some((post: { id: string }) => post.id === id)).toBe(true);
  const menu = await openSharingMenu(owner, id);
  await menu.getByRole("button", { name: "Cancel Sharing", exact: true }).click();
  await owner.getByRole("alertdialog", { name: "Cancel Sharing", exact: true }).getByRole("button", { name: "Cancel Sharing", exact: true }).click();
  await expect(owner.getByRole("alertdialog")).toHaveCount(0);
  await expect(owner.locator("textarea").first()).toHaveValue("Keep this note");
  expect((await guest.request.post("/api/groups/join", { data: { token } })).status()).toBe(404);
  expect((await (await guest.request.get("/api/groups")).json()).groups).toHaveLength(0);
  const posts = (await (await owner.request.get("/api/board")).json()).posts;
  expect(posts.some((post: { inviteUrl: string }) => post.inviteUrl === url)).toBe(false);
  await guest.reload(); await expect(guest.locator('[data-group-id="' + id + '"]')).toHaveCount(0);
  await owner.reload(); await expect(owner.locator("textarea").first()).toHaveValue("Keep this note");
});
