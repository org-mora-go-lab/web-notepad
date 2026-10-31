import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("3. 360x640 light 0.8 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 12);
});
