import { expect, test } from "@playwright/test";

import {
  dashboardColumn,
  openPanel,
  readStoredState,
  switchGroup,
} from "../../__util__";
import { dropCard, seedCards } from "./__util__";

test("4. All Group에서도 서로 다른 그룹의 같은 상태 카드를 정렬한다", async ({
  page,
}) => {
  await seedCards(page);
  await switchGroup(page, "All Group");
  await openPanel(page, "dashboard-panel");
  const queued = dashboardColumn(page, "ready").locator(".dashboard-card", {
    hasText: "Queued",
  });
  await queued.dragTo(dashboardColumn(page, "todo"));
  const cards = dashboardColumn(page, "todo").locator(".dashboard-card");
  await dropCard(
    page,
    cards.filter({ hasText: "Queued" }),
    cards.filter({ hasText: "Alpha" }),
  );
  await expect(cards.locator("strong")).toHaveText([
    "Queued",
    "Alpha",
    "Beta",
    "Gamma",
  ]);
  await page.reload();
  await expect(cards.locator("strong")).toHaveText([
    "Queued",
    "Alpha",
    "Beta",
    "Gamma",
  ]);
  const state = await readStoredState(page);
  expect(state.groups.find((g) => g.id === "work")!.tabs[0].title).toBe(
    "Queued",
  );
  expect(
    state.groups
      .find((g) => g.id === "ungrouped")!
      .tabs.map((tab) => tab.title),
  ).toEqual(["Alpha", "Beta", "Gamma"]);
});
