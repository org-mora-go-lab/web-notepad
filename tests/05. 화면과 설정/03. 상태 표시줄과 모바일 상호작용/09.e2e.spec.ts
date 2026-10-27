import { expect, test } from "@playwright/test";
test("9. 문서 바깥 스크롤을 막고 긴 노트는 에디터 내부에서 스크롤한다", async ({
  page,
}) => {
  await page.goto("/");
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 640 });
    const editor = page.locator("textarea").first();
    await editor.fill("A long note line\n".repeat(200));
    expect(
      await page.evaluate(() => ({
        x: document.documentElement.scrollWidth <= innerWidth,
        y: document.documentElement.scrollHeight <= innerHeight,
      })),
    ).toEqual({ x: true, y: true });
    await editor.evaluate((el) => {
      el.scrollTop = el.scrollHeight;
    });
    expect(await editor.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => scrollY)).toBe(0);
  }
});
