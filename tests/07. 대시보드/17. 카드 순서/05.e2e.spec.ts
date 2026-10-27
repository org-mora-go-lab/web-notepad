import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { dashboardColumn, openPanel } from "../../__util__";
import { dropCard, seedSharedCards } from "./__util__";

test("5. 공유 그룹의 카드 정렬은 협업자에게 동기화하고 새로고침 후 유지한다", async ({
  sharing: { owner, guest, id },
}) => {
  await seedSharedCards(owner, id);
  await openPanel(owner, "dashboard-panel");
  const cards = dashboardColumn(owner, "todo").locator(".dashboard-card");
  const saved = owner.waitForResponse(
    (r) => r.url().endsWith("/api/groups/update") && r.ok(),
  );
  await dropCard(
    owner,
    cards.filter({ hasText: "Gamma" }),
    cards.filter({ hasText: "Alpha" }),
  );
  await saved;
  await guest.reload();
  await openPanel(guest, "dashboard-panel");
  await expect(
    dashboardColumn(guest, "todo").locator(".dashboard-card strong"),
  ).toHaveText(["Gamma", "Alpha", "Beta"]);
  await owner.reload();
  await expect(cards.locator("strong")).toHaveText(["Gamma", "Alpha", "Beta"]);
});
