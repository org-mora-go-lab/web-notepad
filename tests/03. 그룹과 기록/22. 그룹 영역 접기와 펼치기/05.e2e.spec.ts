import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand } from "../../__util__";

test("5. 소유권 조회 실패는 임시 분류 없이 다시 시도로 복구한다", async ({
  sharing: { owner, id },
}) => {
  await owner.route("**/api/groups", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await owner.reload();
  await expect(owner.locator("button.auth-command")).toBeVisible();
  if ((await groupsCommand(owner).getAttribute("aria-expanded")) !== "true")
    await groupsCommand(owner).click();
  const notice = owner.locator("#group-shared-list .group-access-error");
  await expect(notice).toContainText("Could not check shared groups.");
  await expect(
    owner.locator('#group-shared-list [data-group-id="' + id + '"]'),
  ).toHaveCount(0);
  await owner.unroute("**/api/groups");
  await notice.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(
    owner.locator('#group-shared-list [data-group-id="' + id + '"]'),
  ).toBeVisible();
  await expect(notice).toHaveCount(0);
});
