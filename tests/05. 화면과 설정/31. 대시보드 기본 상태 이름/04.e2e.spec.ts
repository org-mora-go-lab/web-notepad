import { expect, test } from "@playwright/test";

import {
  customLabels,
  defaultForm,
  defaultLabels,
  saveDefaults,
  seedDefaults,
} from "./__util__";

test("4. 같은 계정의 다른 기기에 기본 상태 이름을 복원한다", async ({
  page,
  context,
  browser,
}) => {
  test.setTimeout(60000);
  await seedDefaults(page, context);
  await saveDefaults(page);
  await expect
    .poll(
      async () => {
        const history = await (
          await page.request.get("/api/notepad/history")
        ).json();
        return history.latest
          ? JSON.parse(history.latest.snapshot).settings.dashboardStatusDefaults
          : null;
      },
      { timeout: 15000 },
    )
    .toEqual({
      icebox: "Ideas",
      todo: "Next",
      ready: "Queued",
      "in-progress": "Working",
      done: "Shipped",
    });
  const device = await browser.newContext({
    baseURL: new URL(page.url()).origin,
    viewport: { width: 390, height: 844 },
  });
  try {
    await device.addCookies(await context.cookies());
    const other = await device.newPage();
    await other.goto("/");
    const form = await defaultForm(other);
    for (let index = 0; index < defaultLabels.length; index++)
      await expect(
        form.getByRole("textbox", { name: defaultLabels[index], exact: true }),
      ).toHaveValue(customLabels[index]);
  } finally {
    await device.close();
  }
});
