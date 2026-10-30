import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { getApi } from "../../__util__/request";
test("2. X로 닫아 DB에서 제거한 탭의 알람도 목록에서 제거한다", async ({
  sharing: { owner, guest, id },
}) => {
  const record = (
    await (await getApi(guest.request, "/api/groups")).json()
  ).groups.find((g: { id: string }) => g.id === id);
  const tab = record.data.tabs[0];
  const response = await guest.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: record.revision,
      data: {
        ...record.data,
        tabs: [
          {
            ...tab,
            open: false,
            title: "Hidden editor tab",
            content: "Hidden editor tab",
          },
        ],
      },
    },
  });
  expect(response.ok()).toBe(true);
  const { notifications } = await (
    await getApi(owner.request, "/api/groups/notifications")
  ).json();
  expect(notifications.some((n: { tabId: string }) => n.tabId === tab.id)).toBe(
    false,
  );
});
