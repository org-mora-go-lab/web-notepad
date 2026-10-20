import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  readActiveGroup,
  seedStatusIntegrity,
} from "../../__util__";

test("7. 카드 상태 메뉴를 Escape로 취소하면 데이터와 상태를 변경하지 않는다", async ({
  page,
}) => {
  await seedStatusIntegrity(page);
  const before = await readActiveGroup(page);
  await dashboardColumn(page, "todo")
    .locator(".dashboard-card", { hasText: "Integrity task" })
    .click({ button: "right" });
  await expect(page.getByRole("menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  expect(await readActiveGroup(page)).toEqual(before);
});
