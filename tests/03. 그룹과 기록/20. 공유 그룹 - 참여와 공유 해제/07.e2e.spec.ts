import { expect } from "@playwright/test";

import { sharingTest as test } from "./__fixture__";
import { openSharingMenu } from "./__util__";

test("7. 나가기 요청이 실패하면 노트를 유지하고 같은 확인창에서 재시도한다", async ({
  sharing: { guest, id },
}) => {
  await guest.route("**/api/groups/leave", (route) =>
    route.fulfill({ status: 503, json: { error: "offline" } }),
  );
  const menu = await openSharingMenu(guest, id);
  await menu.getByRole("button", { name: "Leave group", exact: true }).click();
  const confirmation = guest.getByRole("alertdialog", {
    name: "Leave group",
    exact: true,
  });
  await confirmation
    .getByRole("button", { name: "Leave group", exact: true })
    .click();
  await expect(confirmation.getByRole("alert")).toContainText(
    "Could not update sharing",
  );
  await expect(guest.locator("textarea").first()).toHaveValue("Keep this note");
  await guest.unroute("**/api/groups/leave");
  await confirmation
    .getByRole("button", { name: "Leave group", exact: true })
    .click();
  await expect(confirmation).toHaveCount(0);
  await expect(guest.locator('[data-group-id="' + id + '"]')).toHaveCount(0);
});
