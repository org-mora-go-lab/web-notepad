import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";

test("1. 공유 그룹 탭의 Link는 그룹과 탭 주소를 복사한다", async ({
  sharing,
}) => {
  const { owner, group } = sharing;
  await owner.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await owner
    .locator(".tab-item .tab-select")
    .first()
    .click({ button: "right" });
  await owner.getByRole("menuitem", { name: "Link", exact: true }).click();

  const copied = await owner.evaluate(() => navigator.clipboard.readText());
  const url = new URL(copied);
  expect(url.origin).toBe("http://localhost:3100");
  expect(url.pathname).toBe("/");
  expect(url.searchParams.get("group")).toBe(group.id);
  expect(url.searchParams.get("leftTab")).toBe(group.tabs[0].id);
  expect(url.searchParams.get("pane")).toBe("left");
  await expect(owner.locator(".tab-link-feedback")).toHaveText(
    "Tab link copied",
  );
});
