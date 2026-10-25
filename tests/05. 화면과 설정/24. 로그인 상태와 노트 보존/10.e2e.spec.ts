import { expect, test } from "@playwright/test";

import { getKakaoUser } from "../../../app/api/auth/_lib/kakao";

test("10. 카카오 로그인 시 카카오톡 프로필을 우선 사용하고 조회 실패 시 카카오계정 프로필을 사용한다", async () => {
  const originalFetch = global.fetch;
  const requestedUrls: string[] = [];
  const accountProfile = {
    id: 123,
    kakao_account: {
      profile: {
        nickname: "계정 이름",
        profile_image_url: "https://example.test/account.png",
      },
    },
  };
  let talkAvailable = true;

  global.fetch = async (input, init) => {
    const url = String(input);
    requestedUrls.push(url);
    expect(init?.headers).toEqual({ Authorization: "Bearer test-token" });
    if (url.endsWith("/v2/user/me")) return Response.json(accountProfile);
    if (url.endsWith("/v1/api/talk/profile")) {
      return talkAvailable
        ? Response.json({
            id: 123,
            nickName: "카카오톡 이름",
            profileImageURL: "https://example.test/talk.png",
          })
        : new Response(null, { status: 400 });
    }
    throw new Error(`Unexpected Kakao URL: ${url}`);
  };

  try {
    await expect(getKakaoUser("test-token")).resolves.toEqual({
      id: "123",
      nickname: "카카오톡 이름",
      profileImageUrl: "https://example.test/talk.png",
    });
    talkAvailable = false;
    await expect(getKakaoUser("test-token")).resolves.toEqual({
      id: "123",
      nickname: "계정 이름",
      profileImageUrl: "https://example.test/account.png",
    });
    expect(requestedUrls).toEqual([
      "https://kapi.kakao.com/v2/user/me",
      "https://kapi.kakao.com/v1/api/talk/profile",
      "https://kapi.kakao.com/v2/user/me",
      "https://kapi.kakao.com/v1/api/talk/profile",
    ]);
  } finally {
    global.fetch = originalFetch;
  }
});
