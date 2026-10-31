import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("5. 360x640 light 1.1 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 14);
});
