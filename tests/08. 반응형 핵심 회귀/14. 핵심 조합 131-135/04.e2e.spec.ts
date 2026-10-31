import { test } from "@playwright/test";

import { expectEssentialResponsiveContract } from "../../__util__";

test("4. 1920x1080 system 0.9 핵심 반응형 계약을 유지한다", async ({
  page,
}) => {
  await expectEssentialResponsiveContract(page, 133);
});
