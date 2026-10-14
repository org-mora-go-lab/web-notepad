import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("4. 잘못된 그룹 항목을 건너뛰고 유효한 노트를 복원한다", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      null,
      false,
      42,
      "invalid",
      {},
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Preserved note"),
      ]),
    ],
  });
  await expect(page.locator("textarea")).toHaveValue("Preserved note");
  await expect(page.locator(".tab-item")).toHaveCount(1);
  expect(errors).toEqual([]);
  await page.locator("textarea").fill("Still editable");
  await expect(page.locator("textarea")).toHaveValue("Still editable");
});
