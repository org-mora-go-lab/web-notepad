import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("10. 지원하지 않는 색상을 포함한 주기는 기본 주기로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    { settings: { tabColorCycle: ["red", "invalid", "teal"] } },
  );
  expect((await readStoredState(page)).settings?.tabColorCycle).toEqual([
    "gray",
    "orange",
    "indigo",
  ]);
});
