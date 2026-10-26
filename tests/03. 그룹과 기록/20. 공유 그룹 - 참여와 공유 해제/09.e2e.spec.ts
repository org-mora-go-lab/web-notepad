import { expect } from "@playwright/test";

import { expectTabSavingLine } from "../../__util__";
import { sharingTest as test } from "./__fixture__";

test("9. 공유 그룹도 에디터 수정 후 1초가 지나 실제 저장 중일 때만 탭 상단 선을 움직인다", async ({ sharing: { owner } }) => {
  let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
  await owner.route("**/api/groups/update", async route => { await gate; await route.continue(); });
  try {
    await owner.locator("textarea").first().fill("Edited shared note");
    const title = owner.locator(".tab-item.is-active .tab-title");
    await expect(title).toHaveCSS("animation-name", "none");
    await expectTabSavingLine(owner.locator(".tab-item.is-active"), true);
    await expect(title).toHaveCSS("animation-name", "none");
  } finally { release(); }
});
