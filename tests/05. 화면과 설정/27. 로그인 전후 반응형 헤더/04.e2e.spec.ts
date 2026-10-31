import { expect, test } from "@playwright/test";

import { authProfile } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("4. 로그인 조회 중에는 스켈레톤만 표시하고 완료 후 중앙 푸터에 계정을 표시한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(context);
  let releaseLookup!: () => void;
  const lookupReady = new Promise<void>((resolve) => {
    releaseLookup = resolve;
  });
  await page.route("**/api/auth/session", async (route) => {
    await lookupReady;
    await route.continue();
  });
  await page.goto("/");
  const coreCenter = () =>
    page.locator(".footer-dock-item.is-core").evaluateAll((items) => {
      const boxes = items.map((item) => item.getBoundingClientRect());
      return (
        (Math.min(...boxes.map((box) => box.left)) +
          Math.max(...boxes.map((box) => box.right))) /
        2
      );
    });
  const skeleton = page.getByRole("status", {
    name: "Loading account",
    exact: true,
  });
  let initialBounds;
  let initialCenter;
  try {
    await expect(skeleton).toBeVisible();
    await expect(skeleton).toHaveAttribute("aria-busy", "true");
    await expect(
      page.locator(".footer-auth a, .footer-auth button"),
    ).toHaveCount(0);
    initialBounds = await skeleton.boundingBox();
    initialCenter = await coreCenter();
  } finally {
    releaseLookup();
  }
  const account = page.getByRole("button", {
    name: `${authProfile.nickname} · Account menu`,
    exact: true,
  });
  await expect(account).toBeVisible();
  await expect(skeleton).toHaveCount(0);
  const accountBounds = (await account.boundingBox())!;
  expect(accountBounds.height).toBe(initialBounds!.height);
  expect(initialCenter).toBeCloseTo((await page.viewportSize())!.width / 2, 0);
  expect(await coreCenter()).toBeCloseTo(
    (await page.viewportSize())!.width / 2,
    0,
  );
});
