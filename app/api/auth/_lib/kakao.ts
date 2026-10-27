export type KakaoUser = {
  id: string;
  nickname: string;
  profileImageUrl?: string;
};

type KakaoTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type KakaoUserResponse = {
  id: number;
  kakao_account?: {
    profile?: {
      nickname?: string;
      profile_image_url?: string;
      thumbnail_image_url?: string;
    };
  };
  properties?: {
    nickname?: string;
    profile_image?: string;
    thumbnail_image?: string;
  };
};

type KakaoTalkProfileResponse = {
  id?: number;
  nickName?: string;
  profileImageURL?: string;
  thumbnailURL?: string;
};

const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
const KAKAO_USER_URL = "https://kapi.kakao.com/v2/user/me";
const KAKAO_TALK_PROFILE_URL = "https://kapi.kakao.com/v1/api/talk/profile";

export function getKakaoConfig() {
  const clientId = process.env.KAKAO_REST_API_KEY;
  const redirectUri = process.env.KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    throw new Error("Kakao OAuth environment variables are not configured.");
  }

  return {
    clientId,
    redirectUri,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
  };
}

export async function exchangeKakaoCode(code: string) {
  const { clientId, clientSecret, redirectUri } = getKakaoConfig();
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: clientId,
    redirect_uri: redirectUri,
    code,
  });
  if (clientSecret) body.set("client_secret", clientSecret);

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
    cache: "no-store",
  });
  const result = (await response.json()) as KakaoTokenResponse;

  if (!response.ok || !result.access_token) {
    throw new Error(
      result.error_description ??
        result.error ??
        "Kakao token exchange failed.",
    );
  }

  return result.access_token;
}

export async function getKakaoUser(accessToken: string): Promise<KakaoUser> {
  const response = await fetch(KAKAO_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  const result = (await response.json()) as KakaoUserResponse;

  if (!response.ok || !result.id) {
    throw new Error("Kakao user lookup failed.");
  }

  const profile = result.kakao_account?.profile;
  let talkProfile: KakaoTalkProfileResponse | undefined;
  const nickname =
    profile?.nickname?.trim() || result.properties?.nickname?.trim();
  const profileImageUrl =
    profile?.profile_image_url?.trim() ||
    profile?.thumbnail_image_url?.trim() ||
    result.properties?.profile_image?.trim() ||
    result.properties?.thumbnail_image?.trim();
  try {
    const talkResponse = await fetch(KAKAO_TALK_PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (talkResponse.ok) {
      const candidate = (await talkResponse.json()) as KakaoTalkProfileResponse;
      if (!candidate.id || candidate.id === result.id) talkProfile = candidate;
    }
  } catch {
    // KakaoTalk 연결 또는 프로필 동의가 없어도 카카오계정 로그인을 유지한다.
  }

  return {
    id: String(result.id),
    nickname: talkProfile?.nickName?.trim() || nickname || "Kakao user",
    profileImageUrl:
      talkProfile?.profileImageURL?.trim() ||
      talkProfile?.thumbnailURL?.trim() ||
      profileImageUrl ||
      undefined,
  };
}
