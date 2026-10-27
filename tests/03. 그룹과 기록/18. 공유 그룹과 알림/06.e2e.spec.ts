import { expect, test } from "@playwright/test";

import { signedSession } from "../../__fixture__";
import { authenticateBrowser } from "../../__util__";
import { shareGroup } from "./__util__";

test("6. 오래된 버전의 동시 수정은 거부된다", async ({ browser }) => {
  const owner = await browser.newContext();
  await authenticateBrowser(
    owner,
    signedSession({
      id: `share-owner-${crypto.randomUUID()}`,
      nickname: "Owner",
      expiresAt: Date.now() + 60_000,
    }),
  );
  const page = await owner.newPage();
  await page.goto("/");
  const { url } = await shareGroup(page, "Versioned team");
  const id = new URL(url).searchParams.get("share")!.split(".")[0];
  const listed = await owner.request.get("/api/groups");
  const base = (await listed.json()).groups.find(
    (item: { id: string }) => item.id === id,
  );
  const changed = { ...base.data, name: "First change" };
  const first = await owner.request.post("/api/groups/update", {
    data: { id, baseRevision: base.revision, data: changed },
  });
  expect(first.status()).toBe(200);
  const second = await owner.request.post("/api/groups/update", {
    data: {
      id,
      baseRevision: base.revision,
      data: { ...base.data, name: "Stale change" },
    },
  });
  expect(second.status()).toBe(409);
  expect((await second.json()).group.data.name).toBe("First change");
  await owner.close();
});
