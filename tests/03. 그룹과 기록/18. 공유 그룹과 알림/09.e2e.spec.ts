import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("9. 공유 팝업은 키보드로 닫고 그룹 동작 버튼에 포커스를 복원한다", async ({
  page,
  context,
}) => {
  await authenticateBrowser(
    context,
    signedSession({
      id: `share-owner-${crypto.randomUUID()}`,
      nickname: "Owner",
      expiresAt: Date.now() + 60_000,
    }),
  );
  await page.goto("/");
  const { dialog } = await shareGroup(page, "Keyboard team");
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }).first(),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("button", { name: "Close", exact: true }).last(),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Keyboard team group actions" }),
  ).toBeFocused();
});
