import { expect, test } from "@playwright/test";

import { withKakaoProfile } from "./__mock__";

test("9. 원본 프로필 사진이 없으면 계정 썸네일을 사용한다", async () => {
  const { user } = await withKakaoProfile({
    id: 12345,
    kakao_account: {
      profile: {
        nickname: "사용자",
        profile_image_url: "  ",
        thumbnail_image_url: "https://example.test/thumb.png",
      },
    },
  });
  expect(user).toEqual({
    id: "12345",
    nickname: "사용자",
    profileImageUrl: "https://example.test/thumb.png",
  });
});
