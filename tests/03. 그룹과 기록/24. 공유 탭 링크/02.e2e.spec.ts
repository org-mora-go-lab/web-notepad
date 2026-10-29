import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { getApi, readStoredState, waitForStoredState } from "../../__util__";

test("2. 공유 그룹 구성원은 링크로 들어와 해당 그룹과 탭을 연다", async ({
  sharing,
}) => {
  const { owner, guest, group } = sharing;
  await owner.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await owner.locator(".header .add-tab").click();
  await owner.locator("textarea").fill("Linked second note");
  const linkedId = (await readStoredState(owner)).groups
    .find((item) => item.id === group.id)!
    .tabs.find((tab) => tab.content === "Linked second note")!.id;
  await expect
    .poll(async () => {
      const response = await getApi(owner.request, "/api/groups");
      const result = (await response.json()) as {
        groups: Array<{ id: string; data: { tabs: Array<{ id: string }> } }>;
      };
      return result.groups
        .find((item) => item.id === group.id)
        ?.data.tabs.some((tab) => tab.id === linkedId);
    })
    .toBe(true);
  await owner
    .locator(".tab-select[aria-selected='true']")
    .click({ button: "right" });
  await owner.getByRole("menuitem", { name: "Link", exact: true }).click();
  await expect(owner.locator(".tab-link-feedback")).toHaveText(
    "Tab link copied",
  );
  const url = await owner.evaluate(() => navigator.clipboard.readText());

  await guest.evaluate(() => localStorage.clear());
  await guest.goto(url);
  await waitForStoredState(guest);

  await expect
    .poll(async () => (await readStoredState(guest)).activeGroupId)
    .toBe(group.id);
  await expect(guest.locator(".tab-select[aria-selected='true']")).toHaveText(
    "Linked second note",
  );
  await expect(guest.locator("textarea")).toHaveValue("Linked second note");
});
