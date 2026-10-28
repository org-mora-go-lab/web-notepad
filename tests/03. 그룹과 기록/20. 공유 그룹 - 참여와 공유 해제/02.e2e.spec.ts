import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("2. 참여자의 우클릭·모바일 길게 누르기 메뉴는 나가기를 제공한다", async ({
  sharing: { guest, id },
}) => {
  const desktopMenu = await openSharingMenu(guest, id);
  const row = guest.locator('[data-group-id="' + id + '"]');
  await expect(row.locator(".group-actions > button")).toHaveCount(0);
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
  await expect(row.locator(".group-actions > button")).toHaveCount(0);
  const select = row.locator(".group-select");
  await select.dispatchEvent("pointerdown", {
    pointerType: "touch",
    pointerId: 1,
    button: 0,
    clientX: 100,
    clientY: 100,
  });
  const menu = row.locator(".group-action-dropdown");
  await expect(menu).toBeVisible();
  await select.dispatchEvent("pointerup", {
    pointerType: "touch",
    pointerId: 1,
    button: 0,
  });
  await expect(
    menu.getByRole("button", { name: "Leave group", exact: true }),
  ).toBeInViewport();
});
