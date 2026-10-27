import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";

test("8. 전체 그룹에서는 상태 이름 편집 명령을 비활성화한다", async ({
  page,
}) => {
  await page.goto("/");
  await switchGroup(page, "All Group");
  await page.getByRole("button", { name: "DASHBOARD" }).click();
  await page.getByRole("button", { name: "Dashboard options" }).click();
  await expect(
    page.getByRole("button", { name: "Edit Status" }),
  ).toBeDisabled();
});
