import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import ts from "typescript";

import {
  prdRoot,
  requirementDocuments,
  requirementEntries,
  testsRoot,
} from "./__util__";

test("2. E2E 테스트 제목은 대응하는 PRD 요구사항 번호로 시작하고 독립 동작을 설명한다", async () => {
  const mismatches: string[] = [];
  for (const document of requirementDocuments()) {
    const relative = path.relative(prdRoot, document).slice(0, -3);
    for (const { number } of requirementEntries(document)) {
      const file = path.join(
        testsRoot,
        relative,
        `${String(number).padStart(2, "0")}.e2e.spec.ts`,
      );
      const source = ts.createSourceFile(
        file,
        readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      );
      const statement = source.statements.find(
        (node) =>
          ts.isExpressionStatement(node) &&
          ts.isCallExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "test",
      );
      const call =
        statement &&
        ts.isExpressionStatement(statement) &&
        ts.isCallExpression(statement.expression)
          ? statement.expression
          : null;
      const actual =
        call && ts.isStringLiteralLike(call.arguments[0])
          ? call.arguments[0].text
          : "";
      if (
        !actual.startsWith(`${number}. `) ||
        actual.length <= `${number}. `.length
      )
        mismatches.push(path.relative(testsRoot, file));
    }
  }

  expect(mismatches).toEqual([]);
});
