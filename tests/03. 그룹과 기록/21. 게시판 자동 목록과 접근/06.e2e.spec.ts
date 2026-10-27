import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { openBoard, selectBoardPost } from "../../__util__";

test("6. 참여한 그룹은 참여 대신 나가기를 제공하며 다른 사람의 접근을 보존한다", async ({
  sharing: { guest, owner, group, id },
}) => {
  await guest.keyboard.press("Escape");
  await openBoard(guest);
  await selectBoardPost(guest, group.name, id);
  await expect(
    guest.getByRole("link", { name: "Join this group" }),
  ).toHaveCount(0);
  await guest
    .locator(".board-detail")
    .getByRole("button", { name: "Leave group", exact: true })
    .click();
  await guest
    .getByRole("alertdialog")
    .getByRole("button", { name: "Leave group", exact: true })
    .click();
  await expect(guest.getByRole("alertdialog")).toHaveCount(0);
  expect(
    (await (await guest.request.get("/api/groups")).json()).groups.some(
      (item: { id: string }) => item.id === id,
    ),
  ).toBe(false);
  expect(
    (await (await owner.request.get("/api/groups")).json()).groups.some(
      (item: { id: string }) => item.id === id,
    ),
  ).toBe(true);
  await selectBoardPost(guest, group.name, id);
  await expect(
    guest.getByRole("link", { name: "Join this group" }),
  ).toBeVisible();
});
