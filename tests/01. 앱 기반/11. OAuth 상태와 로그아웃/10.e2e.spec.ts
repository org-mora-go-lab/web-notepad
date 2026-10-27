import { expect, test } from "@playwright/test";

import { withKakaoProfile } from "./__mock__";

test("10. 다른 사용자 ID의 카카오톡 프로필은 표시하지 않는다", async () => {
  const { user } = await withKakaoProfile(
    {
      id: 12345,
      kakao_account: {
        profile: {
          nickname: "계정 사용자",
          profile_image_url: "https://example.test/account.png",
        },
      },
    },
    {
      id: 98765,
      nickName: "다른 사용자",
      profileImageURL: "https://example.test/talk.png",
    },
  );
  expect(user).toEqual({
    id: "12345",
    nickname: "계정 사용자",
    profileImageUrl: "https://example.test/account.png",
  });
});
