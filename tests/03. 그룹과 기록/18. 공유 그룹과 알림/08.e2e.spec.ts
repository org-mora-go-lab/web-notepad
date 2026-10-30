import { expect } from "@playwright/test";

import { sharingTest as test } from "../../__fixture__";
import { getApi } from "../../__util__/request";

test("8. 공유 탭의 X 닫기는 명시적 삭제 의도와 함께 저장한다", async ({
  sharing: { owner, id },
}) => {
  const record = (
    await (await getApi(owner.request, "/api/groups")).json()
  ).groups.find((group: { id: string }) => group.id === id);
  const tab = record.data.tabs[0];
  const updateRequest = owner.waitForRequest(
    (request) =>
      request.url().endsWith("/api/groups/update") &&
      request.method() === "POST" &&
      (
        request.postDataJSON() as { deletedTabIds?: string[] }
      ).deletedTabIds?.includes(tab.id) === true,
  );
  const updateResponse = owner.waitForResponse(
    (response) =>
      response.url().endsWith("/api/groups/update") &&
      response.request().method() === "POST" &&
      (
        response.request().postDataJSON() as {
          deletedTabIds?: string[];
        }
      ).deletedTabIds?.includes(tab.id) === true,
  );

  await owner
    .getByRole("button", { name: `Close ${tab.title}`, exact: true })
    .click();
  expect(
    ((await updateRequest).postDataJSON() as { deletedTabIds: string[] })
      .deletedTabIds,
  ).toContain(tab.id);
  expect((await updateResponse).ok()).toBe(true);

  await expect
    .poll(async () => {
      const groups = await (await getApi(owner.request, "/api/groups")).json();
      return groups.groups.find((group: { id: string }) => group.id === id).data
        .tabs;
    })
    .toEqual([]);
});
