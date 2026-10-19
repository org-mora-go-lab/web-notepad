export function insertAtSelection(
  content: string,
  start: number,
  end: number,
  insertedText: string,
) {
  return {
    content: content.slice(0, start) + insertedText + content.slice(end),
    cursorPosition: start + insertedText.length,
  };
}

export function removeTabIndent(
  content: string,
  start: number,
  end: number,
) {
  const firstLineStart = content.lastIndexOf("\n", start - 1) + 1;
  const lastSelectedCharacter = end > start && content[end - 1] === "\n" ? end - 1 : end;
  const removed: number[] = [];
  for (let lineStart = firstLineStart; lineStart <= lastSelectedCharacter;) {
    if (content[lineStart] === "\t") removed.push(lineStart);
    const nextLine = content.indexOf("\n", lineStart);
    if (nextLine < 0) break;
    lineStart = nextLine + 1;
  }
  // A Tab inserted after text can also be undone directly at the caret.
  if (removed.length === 0 && start === end && content[start - 1] === "\t") {
    removed.push(start - 1);
  }
  if (removed.length === 0) return null;

  const nextContent = content.split("");
  for (const index of [...removed].reverse()) nextContent.splice(index, 1);
  return {
    content: nextContent.join(""),
    selectionStart: start - removed.filter((index) => index < start).length,
    selectionEnd: end - removed.filter((index) => index < end).length,
  };
}

export function isImeComposing(
  event: Pick<KeyboardEvent, "isComposing" | "keyCode">,
  compositionActive: boolean,
) {
  return compositionActive || event.isComposing || event.keyCode === 229;
}
