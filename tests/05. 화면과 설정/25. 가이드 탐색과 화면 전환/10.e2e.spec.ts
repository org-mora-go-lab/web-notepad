import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openGuide, readStoredState, writeStoredState } from "../../__util__";

test("10. 가이드에서 단축키 패널을 열어도 노트와 줄 선택을 보존한다", async ({
  page,
}) => {
  await writeStoredState(page, {
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Guide note\nselected", {
          selectedLines: [1],
        }),
      ]),
    ],
  });
  const guide = await openGuide(page);
  await guide.getByRole("button", { name: "SHORTCUT", exact: true }).click();
  await expect(guide).toHaveCount(0);
  await expect(page.locator("#shortcuts-panel")).toHaveAttribute(
    "aria-hidden",
    "false",
  );
  await expect(page.locator("textarea")).toHaveValue("Guide note\nselected");
  expect((await readStoredState(page)).groups[0].tabs[0].selectedLines).toEqual(
    [1],
  );
});
