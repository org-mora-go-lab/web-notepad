import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("4. 로그인 조회 중에는 스켈레톤만 표시하고 완료 후 같은 위치에 계정을 표시한다", async ({ page, context }) => {
  await authenticateBrowser(context);
  let releaseLookup!: () => void;
  const lookupReady = new Promise<void>(resolve => { releaseLookup = resolve; });
  await page.route("**/api/auth/session", async route => {
    await lookupReady;
    await route.continue();
  });
  await page.goto("/");
  const skeleton = page.getByRole("status", { name: "Loading account", exact: true });
  let initialBounds;
  try {
    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveAttribute("aria-busy", "true");
    await expect(page.locator(".header-auth a, .header-auth button")).toHaveCount(0);
    initialBounds = await skeleton.boundingBox();
  } finally { releaseLookup(); }
  const account = page.getByRole("button", { name: `${authProfile.nickname} · Account menu`, exact: true });
  await expect(account).toBeVisible();
  await expect(skeleton).toHaveCount(0);
  expect(await account.boundingBox()).toEqual(initialBounds);
});
