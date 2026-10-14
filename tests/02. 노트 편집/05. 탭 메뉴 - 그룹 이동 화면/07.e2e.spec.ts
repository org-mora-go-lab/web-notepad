import { expect, test } from "@playwright/test";

import { BOTH_VIEWPORTS } from "../../__constant__";
import { moveGroupSourceTab, openTabMenu, seedMoveGroupState, writeStoredState } from "../../__util__";

test("7. 긴 그룹 이름은 말줄임과 전체 이름 툴팁으로 표시한다", async ({ page }) => {
  const longName = "Very long target group name that should be truncated in the menu";
  for (const viewport of BOTH_VIEWPORTS) {
    await page.setViewportSize(viewport);
    const state = await seedMoveGroupState(page);
    state.groups[1].name = longName;
    await writeStoredState(page, state);
    await openTabMenu(moveGroupSourceTab(page), viewport);
    await page.getByRole("menuitem", { name: "Move Group", exact: true }).click();

    const option = page.getByRole("menu", { name: "Move Group", exact: true })
      .getByRole("menuitem", { name: longName, exact: true });
    await expect(option).toHaveAttribute("title", longName);
    await expect.poll(() => option.evaluate((element) => {
      const target = Array.from(element.querySelectorAll<HTMLElement>("*"))
        .concat(element as HTMLElement)
        .find((node) => getComputedStyle(node).textOverflow === "ellipsis");
      return target ? target.scrollWidth > target.clientWidth : false;
    })).toBe(true);
  }
});
