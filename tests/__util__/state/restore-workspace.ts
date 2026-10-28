import { expect, type Page } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openMoreMenu } from "../workspace";
import { writeStoredState } from "./stored-state";

// Corrupt input intentionally stays unknown rather than pretending to be valid domain data.
export async function restoreWorkspace(
  page: Page,
  groupPatch: Record<string, unknown> = {},
  statePatch: Record<string, unknown> = {},
) {
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    nextTabNumber: 10,
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture("tab-1", "Alpha\nsecond\nthird"),
        createTabFixture("tab-2", "Beta"),
        createTabFixture("tab-3", "Gamma"),
        createTabFixture("tab-4", "Hidden", { open: false }),
      ]),
    ].map((group) => ({ ...group, ...groupPatch })),
    ...statePatch,
  });
  await expect(page.locator("textarea").first()).toBeVisible();
  // Selecting the current group persists the hydrated result without changing note data.
  await (
    await openMoreMenu(page)
  )
    .getByRole("button", { name: "Ungrouped", exact: true })
    .click();
  if (
    (await page
      .locator(".group-select-command")
      .getAttribute("aria-expanded")) === "true"
  )
    await page.keyboard.press("Escape");
}
