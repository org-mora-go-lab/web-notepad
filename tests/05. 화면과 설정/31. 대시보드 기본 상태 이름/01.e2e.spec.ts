import { expect, test } from "@playwright/test";

import { switchGroup } from "../../__util__";
import {
  customLabels,
  dashboardLabels,
  defaultForm,
  saveDefaults,
  seedDefaults,
} from "./__util__";

test("1. 데이터 삭제 영역 위의 기본 상태 이름을 저장하면 전체 그룹에 적용하고 재접속 후 복원한다", async ({
  page,
  context,
}) => {
  await seedDefaults(page, context);
  const form = await defaultForm(page);
  const section = form.locator("..");
  expect((await section.boundingBox())!.y).toBeLessThan(
    (await page.locator(".setting-danger-zone").boundingBox())!.y,
  );
  await saveDefaults(page);
  for (const group of ["Ungrouped", "Work", "All Group"]) {
    await switchGroup(page, group);
    await expect(await dashboardLabels(page)).toHaveText(customLabels);
  }
  await page.reload();
  await expect(await dashboardLabels(page)).toHaveText(customLabels);
});
