import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("2. 참여자의 PC·모바일 액션 버튼 메뉴는 나가기를 제공한다", async ({
  sharing: { guest, id },
}) => {
  const desktopMenu = await openSharingMenu(guest, id);
  const row = guest.locator('[data-group-id="' + id + '"]');
  await expect(row.locator(".group-actions > button")).toHaveCount(1);
  await expect(
    desktopMenu.getByRole("button", { name: "Leave group", exact: true }),
  ).toBeVisible();
  await expect(
    desktopMenu.getByRole("button", {
      name: /Cancel Sharing|Share Shared team group|Delete Shared team group/,
    }),
  ).toHaveCount(0);
  await guest.keyboard.press("Escape");
  await guest.setViewportSize({ width: 390, height: 844 });
  await expect(row.locator(".group-actions > button")).toHaveCount(1);
  await row.locator(".group-actions > button").click();
  const menu = row.locator(".group-action-dropdown");
  await expect(menu).toBeVisible();
  await expect(
    menu.getByRole("button", { name: "Leave group", exact: true }),
  ).toBeInViewport();
});
