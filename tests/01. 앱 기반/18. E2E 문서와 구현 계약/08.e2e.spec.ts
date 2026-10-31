import { existsSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";

import { prdRoot, requirementDocuments, testsRoot } from "./__util__";

test("8. 상세 PRD 문서와 E2E 디렉터리는 동일한 카테고리와 제목 경로를 사용한다", async () => {
  const missing: string[] = [];
  for (const document of requirementDocuments()) {
    const relative = path.relative(prdRoot, document);
    const testDirectory = path.join(testsRoot, relative.slice(0, -3));
    if (!existsSync(testDirectory)) {
      missing.push(relative);
    }
  }

  await test.step("상세 PRD별 동일 경로의 테스트 디렉터리를 확인한다", async () => {
    expect(missing).toEqual([]);
  });
});
