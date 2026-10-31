import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("9. 375x667 dark 0.8 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 18);
});
