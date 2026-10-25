import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";

test("6. 움직임 줄이기 환경에서는 저장 중 탭 제목의 반짝임을 정지한다", async ({ page, context }) => {
  await authenticateBrowser(context, signedSession({ id: `reduced-save-${crypto.randomUUID()}`, nickname: "Cloud User", expiresAt: Date.now() + 60_000 }));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("button.auth-command")).toContainText("Cloud User");
  await page.locator("textarea").first().fill("움직임 없이 저장할 글");
  await expect(page.locator(".home")).toHaveAttribute("data-cloud-save", "pending");
  const title = page.locator(".tab-item.is-active .tab-title").first();
  await expect(title).toHaveCSS("animation-name", "none");
  await expect(title).toHaveCSS("background-image", "none");
});
