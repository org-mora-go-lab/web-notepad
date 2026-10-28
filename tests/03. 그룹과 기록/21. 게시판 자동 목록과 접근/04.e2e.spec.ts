import { expect, test } from "@playwright/test";

import {
  createGroupFixture,
  createTabFixture,
  signedSession,
} from "../../__fixture__";
import { openBoard, sessionHeaders } from "../../__util__";
import { getApi } from "../../__util__/request";

test("4. 공유 그룹 이름의 HTML은 실행하지 않고 글자로 표시하며 본문을 공개하지 않는다", async ({
  page,
  request,
}) => {
  const title = '<img src=x onerror="window.boardInjected=1">';
  const headers = sessionHeaders(
    signedSession({
      id: crypto.randomUUID(),
      nickname: "Owner",
      expiresAt: Date.now() + 300_000,
    }),
  );
  const result = await request.post("/api/groups/share", {
    headers,
    data: {
      group: createGroupFixture("safe-" + crypto.randomUUID(), title, [
        createTabFixture("note", "Private body " + crypto.randomUUID()),
      ]),
    },
  });
  expect(result.ok()).toBe(true);
  const { group } = await result.json();
  try {
    await page.goto("/");
    await openBoard(page);
    await page
      .getByRole("searchbox", { name: "Search shared groups" })
      .fill(title);
    await expect(page.locator(".board-entry strong")).toHaveText(title);
    await expect(page.locator(".board-entry img")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => (window as Window & { boardInjected?: number }).boardInjected,
      ),
    ).toBeUndefined();
    expect(await (await getApi(request, "/api/board")).text()).not.toContain(
      group.tabs[0].content,
    );
  } finally {
    await request.post("/api/groups/revoke", {
      headers,
      data: { id: group.id },
    });
  }
});
