import { useCallback, useEffect, useState } from "react";

import type { BoardPost } from "@/src/4-entity/notepad";

export function useBoard() {
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);
  const reload = useCallback(() => {
    setLoading(true);
    setError(false);
    setRevision((current) => current + 1);
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/board", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Board unavailable");
        const result = (await response.json()) as { posts: BoardPost[] };
        if (!controller.signal.aborted) setPosts(result.posts);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [revision]);
  return { posts, loading, error, reload };
}
