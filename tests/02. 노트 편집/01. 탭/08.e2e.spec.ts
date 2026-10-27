import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";

test("8. 선택한 연속 탭을 순서를 유지한 채 함께 드래그한다", async ({
  page,
}) => {
  await page.goto("/");
  const editor = page.locator("textarea");
  for (const title of ["first", "second", "third", "fourth", "fifth"]) {
    await editor.fill(title);
    if (title !== "fifth") await addTabButton(page).click();
  }

  const tabs = page.locator(".tab-item");
  await tabs.nth(1).getByRole("tab").click();
  await tabs
    .nth(3)
    .getByRole("tab")
    .click({ modifiers: ["Shift"] });
  await tabs
    .nth(2)
    .locator(".tab-title")
    .dragTo(tabs.nth(4).locator(".tab-title"));

  await expect(tabs.locator(".tab-title")).toHaveText([
    "first",
    "fifth",
    "second",
    "third",
    "fourth",
  ]);
});
