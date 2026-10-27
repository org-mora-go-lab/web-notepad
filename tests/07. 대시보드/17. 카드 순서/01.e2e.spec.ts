import { expect, test } from "@playwright/test";

import { dashboardColumn, openPanel, readActiveGroup } from "../../__util__";
import { dropCard, seedCards } from "./__util__";

test("1. 같은 상태의 카드를 앞뒤로 정렬하고 에디터 탭 순서와 본문을 보존한다", async ({
  page,
}) => {
  await seedCards(page);
  await openPanel(page, "dashboard-panel");
  const cards = dashboardColumn(page, "todo").locator(".dashboard-card");
  const card = (name: string) => cards.filter({ hasText: name });
  await dropCard(page, card("Gamma"), card("Alpha"));
  await expect(cards.locator("strong")).toHaveText(["Gamma", "Alpha", "Beta"]);
  await dropCard(page, card("Gamma"), card("Beta"), "after");
  await expect(cards.locator("strong")).toHaveText(["Alpha", "Beta", "Gamma"]);
  await dropCard(page, card("Beta"), card("Alpha"));
  await page.reload();
  await expect(cards.locator("strong")).toHaveText(["Beta", "Alpha", "Gamma"]);
  const group = await readActiveGroup(page);
  expect(group.tabs.map((tab) => tab.title)).toEqual([
    "Alpha",
    "Beta",
    "Gamma",
  ]);
  expect(group.tabs.map((tab) => tab.content)).toEqual([
    "Alpha\nkept body",
    "Beta\nkept body",
    "Gamma\nkept body",
  ]);
});
