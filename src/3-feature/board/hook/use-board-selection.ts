import { useEffect, useState } from "react";

import type { BoardPost } from "@/src/4-entity/notepad";

const POST_QUERY = "post";
const DETAIL_HISTORY_KEY = "__webNotepadBoardDetail";

export function useBoardSelection(posts: BoardPost[]) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const syncSelection = () =>
      setSelectedId(new URL(window.location.href).searchParams.get(POST_QUERY));
    syncSelection();
    window.addEventListener("popstate", syncSelection);
    return () => window.removeEventListener("popstate", syncSelection);
  }, []);

  const select = (id: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set(POST_QUERY, id);
    window.history.pushState(
      { ...window.history.state, [DETAIL_HISTORY_KEY]: true },
      "",
      url.toString(),
    );
    setSelectedId(id);
  };

  const back = () => {
    if (window.history.state?.[DETAIL_HISTORY_KEY]) {
      window.history.back();
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete(POST_QUERY);
    window.history.replaceState(window.history.state, "", url.toString());
    setSelectedId(null);
  };

  return {
    selected: posts.find((post) => post.id === selectedId) ?? null,
    select,
    back,
  };
}
