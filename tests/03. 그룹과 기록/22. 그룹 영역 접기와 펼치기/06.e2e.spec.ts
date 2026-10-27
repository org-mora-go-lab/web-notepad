import { expect, test } from "@playwright/test";

import { groupsCommand } from "../../__util__";

test("6. My Group과 Shared Group은 생성·전체 그룹 사이를 절반씩 차지하고 중복 경계선을 없앤다", async ({
  page,
}) => {
  for (const width of [1280, 320]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    if ((await groupsCommand(page).getAttribute("aria-expanded")) !== "true")
      await groupsCommand(page).click();
    const my = page.locator(".group-category").first(),
      shared = page.locator(".group-category").last();
    const a = (await my.boundingBox())!,
      b = (await shared.boundingBox())!;
    expect(a.height).toBeCloseTo(b.height, 0);
    expect(a.y + a.height).toBeCloseTo(b.y, 0);
    const form = (await page.locator(".group-create-form").boundingBox())!,
      system = (await page.locator(".group-system-list").boundingBox())!;
    expect(a.y).toBeGreaterThanOrEqual(form.y + form.height);
    const padding = await page
      .locator(".group-list")
      .evaluate((el) => parseFloat(getComputedStyle(el).paddingBottom));
    expect(b.y + b.height + padding).toBeCloseTo(system.y, 0);
    await expect(
      my.getByRole("button", { name: "My Group", exact: true }),
    ).toHaveCSS("border-top-width", "0px");
    await expect(
      shared.getByRole("button", { name: "Shared Group", exact: true }),
    ).toHaveCSS("border-top-width", "1px");
  }
});
