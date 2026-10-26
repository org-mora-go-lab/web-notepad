import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("2. 참여자의 두 그룹 메뉴는 나가기를 제공하고 주최자 동작은 숨긴다", async ({ sharing: { guest, id } }) => {
  for (const method of ["context", "button"] as const) {
    const menu = await openSharingMenu(guest, id, method);
    await expect(menu.getByRole("button", { name: "Leave group", exact: true })).toBeVisible();
    await expect(menu.getByRole("button", { name: /Cancel Sharing|Share Shared team group|Delete Shared team group/ })).toHaveCount(0);
    await guest.keyboard.press("Escape");
  }
  await guest.setViewportSize({ width: 390, height: 844 });
  const menu = await openSharingMenu(guest, id);
  await expect(menu.getByRole("button", { name: "Leave group", exact: true })).toBeInViewport();
});
