import { expect, type Locator } from "@playwright/test";

export async function expectPanelTimes(headings: Locator) {
  await expect(headings.first().locator("xpath=ancestor::aside")).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
  const fields = headings.locator("time");
  await expect(fields).toHaveCount(2);
  const mobile = headings.page().viewportSize()!.width <= 640;
  const bounds = [];
  for (const heading of await headings.all()) {
    const time = heading.locator("time");
    await expect(time).toHaveText("26. 10. 11.\n11:30 AM", { useInnerText: true });
    await expect(time).toHaveAttribute("datetime", "2026-10-11T11:30:00.000Z");
    await expect(time).toHaveCSS("white-space", "pre");
    await expect(time).toHaveCSS("flex-shrink", "0");
    await expect(time).toHaveCSS("height", mobile ? "38px" : "32px");
    const timeBounds = (await time.boundingBox())!;
    const titleBounds = (await heading.locator("strong").boundingBox())!;
    expect(titleBounds.x + titleBounds.width).toBeLessThanOrEqual(timeBounds.x);
    const headingBounds = (await heading.boundingBox())!;
    expect(timeBounds.x + timeBounds.width).toBeCloseTo(headingBounds.x + headingBounds.width, 1);
    expect(await time.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    bounds.push(timeBounds);
  }
  expect(bounds[0].x).toBeCloseTo(bounds[1].x, 1);
  expect(bounds[0].width).toBeCloseTo(bounds[1].width, 1);
}