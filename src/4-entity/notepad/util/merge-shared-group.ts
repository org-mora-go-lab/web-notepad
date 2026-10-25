import type { BookmarkEntry, NoteTab, SharedGroupData } from "../type";

const equal = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);

function mergeField<Value>(base: Value, local: Value, remote: Value): Value {
  if (equal(local, base)) return remote;
  if (equal(remote, base)) return local;
  return local;
}

function mergeItems<Item extends { id: string }>(base: Item[], local: Item[], remote: Item[]): Item[] {
  const baseById = new Map(base.map((item) => [item.id, item]));
  const localById = new Map(local.map((item) => [item.id, item]));
  const remoteById = new Map(remote.map((item) => [item.id, item]));
  const ids = [...new Set([...remote.map((item) => item.id), ...local.map((item) => item.id)])];
  return ids.flatMap((id) => {
    const previous = baseById.get(id);
    const mine = localById.get(id);
    const theirs = remoteById.get(id);
    if (!mine && !theirs) return [];
    if (!mine) return previous && equal(theirs, previous) ? [] : [theirs!];
    if (!theirs) return previous && equal(mine, previous) ? [] : [mine];
    if (!previous) return [mine];
    const merged = { ...theirs } as Item;
    for (const key of Object.keys(mine) as (keyof Item)[]) {
      merged[key] = mergeField(previous[key], mine[key], theirs[key]);
    }
    return [merged];
  });
}

export function mergeSharedGroupData(
  base: SharedGroupData,
  local: SharedGroupData,
  remote: SharedGroupData,
): SharedGroupData {
  return {
    ...remote,
    name: mergeField(base.name, local.name, remote.name),
    updatedAt: Math.max(local.updatedAt, remote.updatedAt),
    tabs: mergeItems<NoteTab>(base.tabs, local.tabs, remote.tabs),
    bookmarks: mergeItems<BookmarkEntry>(base.bookmarks, local.bookmarks, remote.bookmarks),
    dashboardStatusNames: mergeField(base.dashboardStatusNames, local.dashboardStatusNames, remote.dashboardStatusNames),
    dashboardVisibility: mergeField(base.dashboardVisibility, local.dashboardVisibility, remote.dashboardVisibility),
  };
}
