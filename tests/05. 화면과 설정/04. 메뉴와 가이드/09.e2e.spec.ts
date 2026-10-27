import { expect, test } from "@playwright/test";

import { openGuide, writeStoredState } from "../../__util__";

test("9. PC와 모바일 사용 가이드의 탭 메뉴 안내는 고정을 소개하지 않는다", async ({
  page,
}) => {
  for (const language of ["en", "ko"] as const) {
    for (const width of [1280, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await writeStoredState(page, { settings: { language } });
      const guide = await openGuide(page);
      for (let step = 0; step < (width > 512 ? 4 : 3); step += 1)
        await guide.getByRole("button", { name: /^(Next|다음)$/ }).click();
      await expect(
        guide.getByRole("heading", { name: /^(Tab menu|탭 메뉴)$/ }),
      ).toBeVisible();
      await expect(guide).not.toContainText(/to pin|고정/);
      await expect(guide).toContainText(
        language === "en" ? "bookmark" : "북마크",
      );
    }
  }
});
