import { expect, test } from "@playwright/test";

import { readStoredState, seedStoredStateOnce } from "../../__util__";

test("9. 숫자가 아닌 다음 탭 번호를 기본 숫자로 복구해 새 탭을 생성한다", async ({ page }) => {
  await seedStoredStateOnce(page, { nextTabNumber: "invalid" });
  await page.getByRole("button", { name: "New tab", exact: true }).click();
  const state = await readStoredState(page);
  expect(state.nextTabNumber).toBeGreaterThan(2);
  expect(state.groups[0].tabs.at(-1)?.id).toMatch(/^tab-\d+$/);
});
