import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("4. 1280x720 light 1.1 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 113);
});
