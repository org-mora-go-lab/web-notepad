import { expect, test } from "@playwright/test";

import { addTabButton } from "../../__util__";
import { dragTabToZone, paneSlot } from "../__util__";

test("7. Split left로 드래그한 탭를 왼쪽에 두고 나머지를 오른쪽으로 옮긴다", async ({
  page,
}) => {
  await page.goto("/");
  for (const title of ["first", "second", "third"]) {
    await page.locator("textarea").first().fill(title);
    if (title !== "third") await addTabButton(page).click();
  }
  const left = paneSlot(page, "left"),
    tabs = left.locator(".tab-item");
  await tabs.nth(0).getByRole("tab").click();

  await dragTabToZone(page, tabs.nth(0), left, "Split left");
  await expect(left.locator(".tab-title")).toHaveText(["first"]);
  await expect(paneSlot(page, "right").locator(".tab-title")).toHaveText([
    "second",
    "third",
  ]);
  await expect(left.locator("textarea")).toHaveValue("first");
  await page.reload();
  await expect(left.locator(".tab-title")).toHaveText(["first"]);
  await expect(paneSlot(page, "right").locator(".tab-title")).toHaveText([
    "second",
    "third",
  ]);
});
