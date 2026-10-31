import { expect, test } from "@playwright/test";

import { createGroupFixture, createTabFixture } from "../../__fixture__";
import { dashboardColumn, openPanel, writeStoredState } from "../../__util__";

test("6. PC 대시보드 탭 카드는 제목과 본문을 최대 여섯 줄까지 표시한다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  const previewLines = Array.from(
    { length: 7 },
    (_, index) => `본문 미리보기 ${index + 1}`,
  );
  await writeStoredState(page, {
    activeGroupId: "ungrouped",
    groups: [
      createGroupFixture("ungrouped", "Ungrouped", [
        createTabFixture(
          "six-lines",
          ["카드 제목", ...previewLines].join("\n"),
          {
            dashboardStatus: "todo",
          },
        ),
      ]),
    ],
  });
  await openPanel(page, "dashboard-panel");

  const card = dashboardColumn(page, "todo").locator(".dashboard-card", {
    hasText: "카드 제목",
  });
  const preview = card.locator(".dashboard-card-preview");
  await expect(preview).toHaveCSS("-webkit-line-clamp", "5");
  await expect(preview).toContainText("본문 미리보기 7");
  expect(
    await preview.evaluate((element) => {
      const style = getComputedStyle(element);
      return (
        element.getBoundingClientRect().height <=
        parseFloat(style.lineHeight) * 5 + 1
      );
    }),
  ).toBe(true);
});
