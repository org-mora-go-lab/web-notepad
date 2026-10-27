import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { groupsCommand, openAccountMenu } from "../../__util__";

test("5. 알람에서 그룹과 탭으로 이동해도 열려 있던 그룹 사이드바를 유지한다", async ({
  sharing: { owner, guest, id },
}) => {
  const record = (
    await (await guest.request.get("/api/groups")).json()
  ).groups.find((group: { id: string }) => group.id === id);
  const content = "Keep sidebar open after Alarm";
  const update = await guest.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: record.revision,
      data: {
        ...record.data,
        tabs: record.data.tabs.map((tab: { content: string }) => ({
          ...tab,
          content,
          title: content,
        })),
      },
    },
  });
  expect(update.ok()).toBe(true);
  await owner
    .locator(".group-system-list")
    .getByRole("button", { name: "Ungrouped", exact: true })
    .click();
  await expect(groupsCommand(owner)).toHaveAttribute("aria-expanded", "true");
  await owner.evaluate(() => window.dispatchEvent(new Event("focus")));
  const account = await openAccountMenu(owner);
  await account.getByRole("menuitem", { name: "Alarm", exact: true }).click();
  const entry = owner.locator(".notification-entry", { hasText: content });
  await expect(entry).toBeVisible();
  await entry.click();
  await expect(owner.locator("textarea").first()).toHaveValue(content);
  await expect(owner.locator(".group-current-value")).toHaveText(
    record.data.name,
  );
  await expect(groupsCommand(owner)).toHaveAttribute("aria-expanded", "true");
  await expect(owner.locator("#groups-menu")).toBeVisible();
  await expect(
    owner.locator('.group-item[data-group-id="' + id + '"]'),
  ).toHaveClass(/is-active/);
});
