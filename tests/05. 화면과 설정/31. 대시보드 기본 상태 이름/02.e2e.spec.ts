import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";
import {
  customLabels,
  dashboardLabels,
  saveDefaults,
  seedDefaults,
} from "./__util__";

test("2. 그룹별 Edit Status 이름은 설정의 기본 이름보다 우선한다", async ({
  page,
  context,
}) => {
  await seedDefaults(page, context, true);
  await saveDefaults(page);
  await switchGroup(page, "Work");
  await expect(await dashboardLabels(page)).toHaveText([
    "Ideas",
    "Next",
    "Work queue",
    "Working",
    "Shipped",
  ]);
  await saveDefaults(
    page,
    customLabels.map((label) => (label === "Queued" ? "Prepared" : label)),
  );
  await expect(await dashboardLabels(page)).toHaveText([
    "Ideas",
    "Next",
    "Work queue",
    "Working",
    "Shipped",
  ]);
  await switchGroup(page, "Ungrouped");
  await expect(await dashboardLabels(page)).toHaveText([
    "Ideas",
    "Next",
    "Prepared",
    "Working",
    "Shipped",
  ]);
});
