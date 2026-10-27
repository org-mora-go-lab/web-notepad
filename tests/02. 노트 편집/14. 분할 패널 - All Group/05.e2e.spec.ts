import { expect, test } from "@playwright/test";

import { paneSlot } from "../__util__";
import { createAllGroupQuad } from "./__util__";

test("5. All Group 분할 편집기 사이로 탭을 옮기고 활성 상태를 저장한다", async ({
  page,
}) => {
  const tab = await createAllGroupQuad(page);
  await tab("b")
    .locator(".tab-title")
    .dragTo(paneSlot(page, "left").locator(".header"));
  await expect(page.locator(".pane-slot")).toHaveCount(3);
  await expect(
    paneSlot(page, "left").getByRole("tab", { name: "b", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await page.reload();
  await expect(paneSlot(page, "left").locator("textarea")).toHaveValue("b");
});
