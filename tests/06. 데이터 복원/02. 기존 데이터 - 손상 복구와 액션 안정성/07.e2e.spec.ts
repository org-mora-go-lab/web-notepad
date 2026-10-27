import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { addTabButton, seedStoredStateOnLoad } from "../../__util__";

test("7. 손상된 액션 이름 필드를 제거한 뒤에도 탭 추가가 동작한다", async ({
  page,
}) => {
  await seedStoredStateOnLoad(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Protected note"),
      ]),
    ],
    nextTabNumber: 2,
    addTab: null,
  });
  await addTabButton(page).click();
  await expect(page.locator(".tab-item")).toHaveCount(2);
});
