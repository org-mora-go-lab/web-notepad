import type { NotepadState } from "../type";

const same = (left: unknown, right: unknown) => JSON.stringify(left) === JSON.stringify(right);
const object = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

// Merge against the last acknowledged server state, including deletions.
function merge(base: unknown, local: unknown, remote: unknown): unknown {
  if (same(local, base)) return remote;
  if (same(remote, base) || same(local, remote)) return local;
  if (Array.isArray(local) && Array.isArray(remote)
    && [...local, ...remote].every(item => object(item) && typeof item.id === "string")) {
    const previous = new Map((Array.isArray(base) ? base : []).map(item => [item.id, item]));
    const mine = new Map(local.map(item => [item.id, item]));
    const theirs = new Map(remote.map(item => [item.id, item]));
    return [...new Set([...theirs.keys(), ...mine.keys()])].flatMap(id => {
      const before = previous.get(id);
      const left = mine.get(id);
      const right = theirs.get(id);
      if (!left) return before && same(right, before) ? [] : [right];
      if (!right) return before && same(left, before) ? [] : [left];
      // Two devices can independently allocate tab-2 or edit the same note.
      // Keep both versions as separate tabs instead of discarding either text.
      if (typeof left.content === "string" && "open" in left
        && left.content !== right.content && left.content !== before?.content
        && right.content !== before?.content) {
        return [right, { ...left, id: `${id}-recovered-${crypto.randomUUID()}`, title: `${left.title} (Recovered)`, open: true }];
      }
      return [merge(before, left, right)];
    });
  }
  if (object(local) && object(remote)) {
    const previous = object(base) ? base : {};
    return Object.fromEntries([...new Set([...Object.keys(remote), ...Object.keys(local)])]
      .map(key => [key, key === "nextTabNumber" || key === "updatedAt"
        ? Math.max(Number(local[key]) || 0, Number(remote[key]) || 0)
        : merge(previous[key], local[key], remote[key])]));
  }
  return local;
}

export function mergeCloudSnapshot(base: string | null, local: string, remote: string): string {
  const merged = merge(base ? JSON.parse(base) : undefined, JSON.parse(local), JSON.parse(remote)) as Pick<NotepadState, "groups" | "closedTabs">;
  const ids = new Set<string>();
  for (const group of merged.groups) {
    const replacements = new Map<string, string>();
    group.tabs = group.tabs.map(tab => {
      const id = ids.has(tab.id) ? `${tab.id}-recovered-${crypto.randomUUID()}` : tab.id;
      ids.add(id);
      if (id === tab.id) return tab;
      replacements.set(tab.id, id);
      return { ...tab, id };
    });
    if (!replacements.size) continue;
    const tabId = (id: string) => replacements.get(id) ?? id;
    const optionalTabId = (id: string | null) => id ? tabId(id) : null;
    group.activeTabId = tabId(group.activeTabId);
    group.activeRightTabId = optionalTabId(group.activeRightTabId);
    group.activeLeftBottomTabId = optionalTabId(group.activeLeftBottomTabId);
    group.activeRightBottomTabId = optionalTabId(group.activeRightBottomTabId);
    group.rightTabIds = group.rightTabIds.map(tabId);
    group.leftBottomTabIds = group.leftBottomTabIds.map(tabId);
    group.rightBottomTabIds = group.rightBottomTabIds.map(tabId);
    group.bookmarks = group.bookmarks.map(bookmark => ({ ...bookmark, sourceTabId: tabId(bookmark.sourceTabId) }));
    merged.closedTabs = merged.closedTabs.map(entry => entry.groupId === group.id ? { ...entry, tab: { ...entry.tab, id: tabId(entry.tab.id) } } : entry);
  }
  return JSON.stringify(merged);
}
