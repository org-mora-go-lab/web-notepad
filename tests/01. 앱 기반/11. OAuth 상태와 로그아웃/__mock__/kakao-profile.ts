import { getKakaoUser } from "../../../../app/api/auth/_lib/kakao";

export async function withKakaoProfile(account: unknown, talk?: unknown) {
  const originalFetch = globalThis.fetch;
  const requests: string[] = [];
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    requests.push(url);
    if (init?.headers && new Headers(init.headers).get("Authorization") !== "Bearer profile-test-token") {
      throw new Error("Missing Kakao bearer token");
    }
    if (url === "https://kapi.kakao.com/v2/user/me") return Response.json(account);
    if (url === "https://kapi.kakao.com/v1/api/talk/profile") {
      return Response.json(talk ?? { code: -403 }, { status: talk ? 200 : 403 });
    }
    throw new Error(`Unexpected Kakao request: ${url}`);
  };
  try {
    return { user: await getKakaoUser("profile-test-token"), requests };
  } finally {
    globalThis.fetch = originalFetch;
  }
}
