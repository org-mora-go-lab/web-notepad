import { expect } from "@playwright/test";

import { expectTabSavingLine } from "../../__util__";
import { sharingTest as test } from "./__fixture__";

test("9. 공유 그룹도 에디터 수정 후 0.5초가 지나 실제 저장 중일 때만 탭 상단 선을 움직인다", async ({
  sharing: { owner },
}) => {
  await owner.clock.install();
  await owner.clock.pauseAt(new Date(Date.now() + 1000));
  let posts = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await owner.route("**/api/groups/update", async (route) => {
    posts += 1;
    await gate;
    await route.continue();
  });
  try {
    await owner.locator("textarea").first().fill("Edited shared note");
    const title = owner.locator(".tab-item.is-active .tab-title");
    await expect(title).toHaveCSS("animation-name", "none");
    await owner.clock.runFor(499);
    expect(posts).toBe(0);
    await expectTabSavingLine(owner.locator(".tab-item.is-active"), false);
    await owner.clock.runFor(1);
    await expect.poll(() => posts).toBe(1);
    await expectTabSavingLine(owner.locator(".tab-item.is-active"), true);
    await expect(title).toHaveCSS("animation-name", "none");
  } finally {
    release();
  }
});
