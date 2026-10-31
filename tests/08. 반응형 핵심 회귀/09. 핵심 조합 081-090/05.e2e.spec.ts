import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("5. 768x1024 light 0.8 핵심 반응형 계약을 유지한다", async ({ page }) => {
  await expectEssentialResponsiveContract(page, 84);
});
