import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("2. 390x844 light 0.9 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 31);
});
