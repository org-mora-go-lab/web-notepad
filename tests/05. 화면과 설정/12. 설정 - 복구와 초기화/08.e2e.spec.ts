import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { openSettingsPanel, writeStoredState } from "../../__util__";
import { settingsPanel } from "../__util__";

test("8. 전체 데이터 삭제를 재확인한 뒤 모든 저장값을 지우고 기본 작업공간을 연다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await writeStoredState(page, {
    activeGroupId: "work",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [createTabFixture("tab-1", "")]),
      createGroupFixture("work", "Work", [createTabFixture("tab-2", "Delete me")]),
    ],
    nextTabNumber: 3,
  });
  await page.evaluate(() => {
    localStorage.setItem("web-notepad-theme", "light");
    localStorage.setItem("web-notepad-panel-pinned", "true");
    localStorage.setItem("web-notepad-side-panel-width", "400");
  });

  await openSettingsPanel(page);
  await settingsPanel(page)
    .getByRole("button", { name: "Delete all data", exact: true })
    .click();

  const popup = page.getByRole("alertdialog", { name: "Delete all data" });
  await expect(popup).toContainText(
    "All notes, groups, bookmarks, closed tabs, and settings will be permanently deleted. Are you sure?",
  );
  const cancelButton = popup.getByRole("button", { name: "Cancel", exact: true });
  await expect(cancelButton).toBeFocused();
  await expect(cancelButton).toHaveCSS("display", "flex");
  const deleteAllButton = popup.getByRole("button", { name: "Delete all", exact: true });
  await expect(deleteAllButton).toHaveCSS("display", "flex");
  await expect(deleteAllButton).toHaveCSS("white-space", "nowrap");
  await deleteAllButton.click();

  await expect(page.locator("textarea")).toHaveValue("");
  await expect(page.locator(".group-current-value")).toHaveText(
    "Ungrouped",
  );
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => ({
      storedWorkspace: localStorage.getItem("web-notepad-storage"),
      theme: localStorage.getItem("web-notepad-theme"),
      pinned: localStorage.getItem("web-notepad-panel-pinned"),
      panelWidth: localStorage.getItem("web-notepad-side-panel-width"),
    })),
  ).toMatchObject({
    theme: null,
    pinned: null,
    panelWidth: null,
  });
  expect(
    await page.evaluate(() => localStorage.getItem("web-notepad-storage")),
  ).not.toContain("Delete me");
});
