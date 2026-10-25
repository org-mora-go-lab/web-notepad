import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("8. 작은 모바일 화면에서도 공유 팝업의 모든 동작에 접근할 수 있다", async ({ page, context }) => {
  await page.setViewportSize({ width: 320, height: 480 });
  await authenticateBrowser(context, signedSession({ id: `share-owner-${crypto.randomUUID()}`, nickname: "Owner", expiresAt: Date.now() + 60_000 }));
  await page.goto("/");
  const { dialog } = await shareGroup(page, "Mobile team");
  await expect(dialog.getByLabel("Group share link")).toBeVisible();
  for (const button of [dialog.getByRole("button", { name: "Copy link" }), dialog.getByRole("button", { name: "Close", exact: true }).last()]) {
    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeInViewport();
    expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  const bounds = (await dialog.boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(0);
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(480);
});
