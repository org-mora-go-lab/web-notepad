import { readFileSync } from "node:fs";
import path from "node:path";

import { expect, test } from "@playwright/test";
import ts from "typescript";

import { e2eFiles, testsRoot } from "./__util__";

test("5. E2E 검증 전체를 번호 기반 실행 함수나 단일 외부 함수에 위임하지 않는다", async () => {
  const delegated: string[] = [];
  for (const file of e2eFiles()) {
    const sourceText = readFileSync(file, "utf8");
    const source = ts.createSourceFile(
      file,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
    );
    const statement = source.statements.find(ts.isExpressionStatement);
    const call =
      statement && ts.isCallExpression(statement.expression)
        ? statement.expression
        : null;
    const callback = call?.arguments.at(-1);
    const body =
      callback &&
      (ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)) &&
      callback.body;
    const oneCall =
      body &&
      ts.isBlock(body) &&
      body.statements.length === 1 &&
      body.statements[0];
    if (
      /\b(?:expectEssentialResponsiveContract|run[A-Z][A-Za-z]+Case)\s*\(/.test(
        sourceText,
      )
    ) {
      delegated.push(path.relative(testsRoot, file));
    } else if (
      oneCall &&
      ts.isExpressionStatement(oneCall) &&
      ts.isAwaitExpression(oneCall.expression)
    ) {
      const awaited = oneCall.expression.expression;
      const isStep =
        ts.isCallExpression(awaited) &&
        ts.isPropertyAccessExpression(awaited.expression) &&
        ts.isIdentifier(awaited.expression.expression) &&
        awaited.expression.expression.text === "test" &&
        awaited.expression.name.text === "step";
      if (!isStep) delegated.push(path.relative(testsRoot, file));
    }
  }

  expect(delegated).toEqual([]);
});
