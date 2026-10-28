import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { openPanel } from "../../__util__";

test("6. 공유 그룹 카드 메뉴의 Link는 공유 그룹과 탭 주소를 복사한다", async ({
  sharing,
}) => {
  const { owner, group } = sharing;
  await owner.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await openPanel(owner, "dashboard-panel");
  await owner.locator(".dashboard-card").first().click({ button: "right" });
  await expect(owner.getByRole("menu").getByRole("menuitem")).toHaveText([
    "Link",
    "Bookmark",
    "Move Group",
  ]);
  await owner.getByRole("menuitem", { name: "Link", exact: true }).click();
  const url = new URL(
    await owner.evaluate(() => navigator.clipboard.readText()),
  );
  expect(url.searchParams.get("group")).toBe(group.id);
  expect(url.searchParams.get("leftTab")).toBe(group.tabs[0].id);
  await expect(owner.locator(".tab-link-feedback")).toHaveText(
    "Tab link copied",
  );
});
