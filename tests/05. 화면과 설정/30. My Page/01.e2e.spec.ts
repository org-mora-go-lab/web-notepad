import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
test("1. 계정 메뉴에서 My Page로 이동해 프로필과 내 공유 현황을 보여준다", async ({
  sharing: { owner, guest },
}) => {
  await owner.keyboard.press("Escape");
  await owner.locator("button.auth-command").click();
  await owner.getByRole("menuitem", { name: "My Page", exact: true }).click();
  await expect(owner).toHaveURL(/\/my-page$/);
  await expect(
    owner.getByText("Your writing workspace at a glance."),
  ).toHaveCount(0);
  await expect(
    owner.getByRole("heading", { name: "Owner", exact: true }),
  ).toBeVisible();
  await expect(owner.locator('[data-metric="shared-by-me"] dd')).toHaveText(
    "1",
  );
  await expect(owner.locator('[data-metric="joined"] dd')).toHaveText("0");
  const portrait = await owner.locator(".my-page-portrait").boundingBox();
  const profile = await owner.locator(".my-page-profile").boundingBox();
  const profileColumn = await owner
    .locator(".my-page-profile-column")
    .boundingBox();
  const content = await owner.locator(".my-page-content").boundingBox();
  const sync = await owner.locator(".my-page-sync").boundingBox();
  expect(portrait).not.toBeNull();
  expect(profile).not.toBeNull();
  expect(profileColumn).not.toBeNull();
  expect(content).not.toBeNull();
  expect(sync).not.toBeNull();
  expect(portrait!.x + portrait!.width).toBeLessThan(content!.x);
  expect(profileColumn!.width / content!.width).toBeGreaterThan(0.54);
  expect(profileColumn!.width / content!.width).toBeLessThan(0.6);
  const profileName = (await owner
    .locator(".my-page-profile h2")
    .boundingBox())!;
  const connection = (await owner.locator(".my-page-profile p").boundingBox())!;
  expect(connection.x).toBeGreaterThanOrEqual(
    profileName.x + profileName.width,
  );
  expect(connection.y + connection.height).toBeGreaterThan(profileName.y);
  expect(profile!.y + profile!.height).toBeCloseTo(portrait!.y, 0);
  expect(profileColumn!.height).toBeCloseTo(content!.height, 0);
  expect(Math.abs(sync!.x - portrait!.x)).toBeLessThanOrEqual(1);
  expect(
    Math.abs(sync!.x + sync!.width - (content!.x + content!.width)),
  ).toBeLessThanOrEqual(1);
  await guest.goto("/my-page");
  await expect(guest.locator('[data-metric="joined"] dd')).toHaveText("1");
  await expect(guest.locator('[data-metric="notes"] dd')).toHaveText("1");
});
