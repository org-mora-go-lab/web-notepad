import { test as base } from "@playwright/test";

import type { BoardPost } from "@/src/4-entity/notepad";

import { SESSION_COOKIE, signedSession } from "./auth";
import { createGroupFixture, createTabFixture } from "./notepad-state";

export const boardTest = base.extend<{ boardPost: BoardPost }>({
  boardPost: async ({ request }, provide) => {
    const suffix = crypto.randomUUID();
    const headers = {
      Cookie: `${SESSION_COOKIE}=${signedSession({ id: suffix, nickname: "Board owner", expiresAt: Date.now() + 300_000 })}`,
    };
    const shared = await request.post("/api/groups/share", {
      headers,
      data: {
        group: createGroupFixture(`board-${suffix}`, `Board group ${suffix}`, [
          createTabFixture(`note-${suffix}`, "Private shared note body"),
        ]),
      },
    });
    if (!shared.ok())
      throw new Error(`Cannot prepare shared group: ${shared.status()}`);
    const { url } = (await shared.json()) as { url: string };
    const title = `Community ${suffix}`;
    const published = await request.post("/api/board?role=admin", {
      data: {
        inviteUrl: url,
        title,
        description:
          "A shared place for weekly ideas.\nEveryone can contribute.",
      },
    });
    if (!published.ok())
      throw new Error(`Cannot publish fixture: ${published.status()}`);
    const { posts } = (await (await request.get("/api/board")).json()) as {
      posts: BoardPost[];
    };
    const post = posts.find((item) => item.title === title)!;
    try {
      await provide(post);
    } finally {
      await request.delete("/api/board?role=admin", { data: { id: post.id } });
    }
  },
});
