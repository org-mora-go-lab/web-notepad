import { expect, test } from "@playwright/test";

import { readStoredState } from "../../__util__";
import {
  customLabels,
  defaultForm,
  defaultLabels,
  seedDefaults,
} from "./__util__";

test("5. 기본 상태 이름 Save는 변경과 저장 완료 상태를 알리고 새로고침 후 복원한다", async ({
  page,
  context,
}) => {
  await seedDefaults(page, context);
  const form = await defaultForm(page);
  const save = form.getByRole("button", { name: "Save", exact: true });
  await expect(save).toBeDisabled();

  for (let index = 0; index < defaultLabels.length; index++)
    await form
      .getByRole("textbox", { name: defaultLabels[index], exact: true })
      .fill(customLabels[index]);
  await expect(save).toBeEnabled();
  await save.click();

  await expect(form.getByRole("status")).toHaveText("Saved");
  await expect(save).toBeDisabled();
  expect(
    (await readStoredState(page)).settings?.dashboardStatusDefaults,
  ).toEqual({
    icebox: "Ideas",
    todo: "Next",
    ready: "Queued",
    "in-progress": "Working",
    done: "Shipped",
  });

  await page.reload();
  const restored = await defaultForm(page);
  for (let index = 0; index < defaultLabels.length; index++)
    await expect(
      restored.getByRole("textbox", {
        name: defaultLabels[index],
        exact: true,
      }),
    ).toHaveValue(customLabels[index]);
});
