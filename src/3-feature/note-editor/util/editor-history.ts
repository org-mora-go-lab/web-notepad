type EditorHistoryDirection = "undo" | "redo";

const undoHistoryByTab = new Map<string, string[]>();
const redoHistoryByTab = new Map<string, string[]>();

export function recordEditorHistory(tabId: string, previousContent: string) {
  const history = undoHistoryByTab.get(tabId) ?? [];
  undoHistoryByTab.set(tabId, [...history.slice(-99), previousContent]);
  redoHistoryByTab.delete(tabId);
}

export function restoreEditorHistory(
  tabId: string,
  currentContent: string,
  direction: EditorHistoryDirection,
) {
  const [source, destination] =
    direction === "undo"
      ? [undoHistoryByTab, redoHistoryByTab]
      : [redoHistoryByTab, undoHistoryByTab];
  const history = source.get(tabId) ?? [];
  const restoredContent = history.at(-1);
  if (restoredContent === undefined) return undefined;

  source.set(tabId, history.slice(0, -1));
  destination.set(tabId, [...(destination.get(tabId) ?? []), currentContent]);
  return restoredContent;
}
