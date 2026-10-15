import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, paneSlot } from "../__util__";

test("9. 선택한 연속 탭을 분할 패널로 함께 드래그한다", async ({ page }) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  for (const title of ["first", "second", "third", "fourth"]) {
    await editor.fill(title);
    if (title !== "fourth") await addTabButton(page).click();
  }

  const left = paneSlot(page, "left");
  const tabs = left.locator(".tab-item");
  await tabs.nth(1).getByRole("tab").click();
  await tabs.nth(2).getByRole("tab").click({ modifiers: ["Shift"] });
  await dragTabToZone(page, tabs.nth(1), left, "Split right");

  await expect(left.locator(".tab-title")).toHaveText(["first", "fourth"]);
  await expect(paneSlot(page, "right").locator(".tab-title")).toHaveText([
    "second",
    "third",
  ]);
});
