import path from "node:path";

import { expect, test } from "@playwright/test";

import {
  e2eFiles,
  prdRoot,
  requirementDocuments,
  requirementEntries,
  testsRoot,
} from "./__util__";

test("1. 모든 상세 PRD 요구사항은 같은 번호의 E2E 파일과 일대일로 대응한다", async () => {
  const required = requirementDocuments().flatMap((document) => {
    const relative = path.relative(prdRoot, document).slice(0, -3);
    return requirementEntries(document).map(({ number }) =>
      path.join(relative, `${String(number).padStart(2, "0")}.e2e.spec.ts`),
    );
  });
  const implemented = e2eFiles().map((file) => path.relative(testsRoot, file));

  await test.step("PRD와 E2E의 누락 및 초과 파일을 비교한다", async () => {
    expect(implemented.sort()).toEqual(required.sort());
  });
});
