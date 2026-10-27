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

export function toggleBoldAtSelection(
  content: string,
  start: number,
  end: number,
) {
  const marker = "**";
  const directlyWrapped =
    start >= marker.length &&
    content.slice(start - marker.length, start) === marker &&
    content.slice(end, end + marker.length) === marker;
  if (directlyWrapped) {
    return {
      content:
        content.slice(0, start - marker.length) +
        content.slice(start, end) +
        content.slice(end + marker.length),
      selectionStart: start - marker.length,
      selectionEnd: end - marker.length,
    };
  }

  const selectionIncludesMarkers =
    end - start >= marker.length * 2 &&
    content.slice(start, start + marker.length) === marker &&
    content.slice(end - marker.length, end) === marker;
  if (selectionIncludesMarkers) {
    return {
      content:
        content.slice(0, start) +
        content.slice(start + marker.length, end - marker.length) +
        content.slice(end),
      selectionStart: start,
      selectionEnd: end - marker.length * 2,
    };
  }

  if (start === end) {
    const markerPositions: number[] = [];
    for (
      let index = content.indexOf(marker);
      index >= 0;
      index = content.indexOf(marker, index + marker.length)
    ) {
      markerPositions.push(index);
    }
    for (let index = 0; index + 1 < markerPositions.length; index += 2) {
      const opening = markerPositions[index];
      const closing = markerPositions[index + 1];
      if (start < opening + marker.length || start > closing) continue;
      return {
        content:
          content.slice(0, opening) +
          content.slice(opening + marker.length, closing) +
          content.slice(closing + marker.length),
        selectionStart: start - marker.length,
        selectionEnd: start - marker.length,
      };
    }
  }

  return {
    content:
      content.slice(0, start) +
      marker +
      content.slice(start, end) +
      marker +
      content.slice(end),
    selectionStart: start + marker.length,
    selectionEnd: end + marker.length,
  };
}

export function removeTabIndent(content: string, start: number, end: number) {
  const firstLineStart = content.lastIndexOf("\n", start - 1) + 1;
  const lastSelectedCharacter =
    end > start && content[end - 1] === "\n" ? end - 1 : end;
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
