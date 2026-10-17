import { expect, test } from "@playwright/test";

import { seedStoredStateOnLoad } from "../../__util__";

test("6. 지원하지 않는 언어는 영어로 복구한다", async ({ page }) => {
  await seedStoredStateOnLoad(page, { settings: { language: "xx" } });
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
