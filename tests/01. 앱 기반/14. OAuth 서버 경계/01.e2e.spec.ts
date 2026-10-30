import { test } from "@playwright/test";

import { runOAuthServerCase } from "../../__util__";

test("1. OAuth 시작은 카카오 인증 호스트로만 리다이렉트한다", async ({
  request,
  page,
  context,
}) => {
  await runOAuthServerCase(1, { request, page, context });
});
