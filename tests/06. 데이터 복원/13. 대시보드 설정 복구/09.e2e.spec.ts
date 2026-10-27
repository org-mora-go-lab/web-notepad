import { expect, test } from "@playwright/test";

import { readStoredState, restoreWorkspace } from "../../__util__";

test("9. 색상 주기에 중복 색상이 있으면 기본 주기로 복구한다", async ({
  page,
}) => {
  await restoreWorkspace(
    page,
    {},
    { settings: { tabColorCycle: ["red", "red", "teal"] } },
  );
  expect((await readStoredState(page)).settings?.tabColorCycle).toEqual([
    "gray",
    "orange",
    "indigo",
  ]);
});
