import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand } from "../../__util__";

test("5. 소유권 조회 실패 중에도 로컬 공유 그룹을 우선 표시한다", async ({
  sharing: { owner, id },
}) => {
  await owner.route("**/api/groups", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await owner.reload();
  await expect(owner.locator("button.auth-command")).toBeVisible();
  if ((await groupsCommand(owner).getAttribute("aria-expanded")) !== "true")
    await groupsCommand(owner).click();
  await expect(
    owner.locator('#group-shared-list [data-group-id="' + id + '"]'),
  ).toBeVisible();
});
