import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { seedStoredStateOnLoad } from "../../__util__";

test("5. 활성 탭을 닫으면 URL과 새로고침 후 선택을 새 활성 탭으로 맞춘다", async ({
  page,
}) => {
  const group = createGroupFixture(
    "ungrouped",
    "Ungrouped",
    [
      createTabFixture("tab-a", "A note"),
      createTabFixture("tab-b", "B note"),
      createTabFixture("tab-c", "C note needs confirmation"),
      createTabFixture("tab-d", "D note"),
    ],
    { activeTabId: "tab-b" },
  );
  await seedStoredStateOnLoad(page, {
    activeGroupId: group.id,
    groups: [group],
    nextTabNumber: 5,
  });

  const editor = page.locator("textarea");
  await expect(editor).toHaveValue("B note");
  await page.getByRole("button", { name: "B note 닫기" }).click();
  await expect(editor).toHaveValue("C note needs confirmation");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("leftTab"))
    .toBe("tab-c");

  await page
    .getByRole("button", { name: "C note needs confirmation 닫기" })
    .click();
  await page
    .getByRole("alertdialog", { name: "Close tab" })
    .getByRole("button", { name: "Close", exact: true })
    .click();
  await expect(editor).toHaveValue("D note");
  await expect
    .poll(() => new URL(page.url()).searchParams.get("leftTab"))
    .toBe("tab-d");

  await page.reload();
  await expect(editor).toHaveValue("D note");
  await expect(page.locator('.tab-item.is-active [role="tab"]')).toHaveAttribute(
    "aria-label",
    "D note",
  );
});
