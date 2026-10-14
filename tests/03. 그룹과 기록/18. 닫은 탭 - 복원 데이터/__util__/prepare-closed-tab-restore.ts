import type { Page } from "@playwright/test";

import {
  closeActiveTabWithContent,
  createGroups,
  cycleActiveTabColor,
  lineButtons,
  openClosedPanel,
  switchGroup,
} from "../../../__util__";

export const RESTORED_CONTENT = "restore me\nsecond\nthird";

export async function prepareClosedTabRestore(page: Page) {
  await page.goto("/");
  await createGroups(page, "Work");
  await page.locator("textarea").fill(RESTORED_CONTENT);
  await cycleActiveTabColor(page, 2);
  await lineButtons(page).nth(1).click();
  await closeActiveTabWithContent(page, RESTORED_CONTENT);
  await switchGroup(page, "Ungrouped");
  await openClosedPanel(page);
}
