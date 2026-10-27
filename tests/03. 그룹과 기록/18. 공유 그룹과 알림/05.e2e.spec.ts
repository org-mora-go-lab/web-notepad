import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("5. 공유 권한이 없는 사용자는 그룹을 조회하거나 수정할 수 없다", async ({
  browser,
}) => {
  const owner = await browser.newContext();
  await authenticateBrowser(
    owner,
    signedSession({
      id: `share-owner-${crypto.randomUUID()}`,
      nickname: "Owner",
      expiresAt: Date.now() + 60_000,
    }),
  );
  const ownerPage = await owner.newPage();
  await ownerPage.goto("/");
  const { dialog, url } = await shareGroup(ownerPage, "Private team");
  const groupId = new URL(url).searchParams.get("share")!.split(".")[0];
  const group = await owner.request.get("/api/groups");
  const record = (await group.json()).groups.find(
    (item: { id: string }) => item.id === groupId,
  );
  await dialog
    .getByRole("button", { name: "Close", exact: true })
    .last()
    .click();

  const stranger = await browser.newContext();
  await authenticateBrowser(
    stranger,
    signedSession({
      id: `share-stranger-${crypto.randomUUID()}`,
      nickname: "Stranger",
      expiresAt: Date.now() + 60_000,
    }),
  );
  const list = await stranger.request.get("/api/groups");
  expect((await list.json()).groups).toEqual([]);
  const update = await stranger.request.post("/api/groups/update", {
    data: { id: groupId, baseRevision: record.revision, data: record.data },
  });
  expect(update.status()).toBe(403);
  await stranger.close();
  await owner.close();
});
