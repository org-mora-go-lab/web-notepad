import { expect, test } from "@playwright/test";

import { DESKTOP_VIEWPORT } from "../../__constant__";
import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("1. PC 로그인 전후 핵심 푸터와 탭 추가 위치를 유지한다", async ({
  page,
  context,
}) => {
  await page.setViewportSize(DESKTOP_VIEWPORT);
  await page.goto("/");
  await expect(page.locator("a.auth-command")).toBeVisible();
  await expect(page.locator(".header .auth-command")).toHaveCount(0);
  await expect(page.locator(".footer .auth-command")).toBeVisible();
  const coreCenter = () =>
    page.locator(".footer-dock-item.is-core").evaluateAll((items) => {
      const boxes = items.map((item) => item.getBoundingClientRect());
      return (
        (Math.min(...boxes.map((box) => box.left)) +
          Math.max(...boxes.map((box) => box.right))) /
        2
      );
    });
  const beforeCenter = await coreCenter();
  const beforeAuth = (await page.locator(".footer-auth").boundingBox())!;
  const beforeAdd = (await page.locator(".header .add-tab").boundingBox())!;

  await authenticateBrowser(
    context,
    signedSession({
      id: "layout-desktop",
      nickname: "긴 카카오톡 이름을 가진 사용자",
      profileImageUrl: "https://example.test/avatar.png",
      expiresAt: Date.now() + 60_000,
    }),
  );
  await page.reload();
  await expect(page.locator("button.auth-command")).toBeVisible();
  const afterCenter = await coreCenter();
  const afterAuth = (await page.locator(".footer-auth").boundingBox())!;
  const afterAdd = (await page.locator(".header .add-tab").boundingBox())!;
  expect(beforeCenter).toBeCloseTo(DESKTOP_VIEWPORT.width / 2, 0);
  expect(afterCenter).toBeCloseTo(DESKTOP_VIEWPORT.width / 2, 0);
  await expect(page.locator(".footer-dock")).toHaveCSS("gap", "25px");
  expect(afterAuth.y).toBe(beforeAuth.y);
  expect(afterAuth.height).toBe(beforeAuth.height);
  expect(afterAdd).toEqual(beforeAdd);
});
