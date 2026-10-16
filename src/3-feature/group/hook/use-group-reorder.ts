import { type PointerEvent, useEffect, useRef, useState } from "react";

export function useGroupReorder(onMove: (groupId: string, targetId: string) => void) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanupRef.current?.(), []);

  const start = (groupId: string, event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    cleanupRef.current?.();
    const handle = event.currentTarget;
    const pointerId = event.pointerId;
    const row = handle.closest<HTMLElement>("[data-group-id]");
    const list = handle.closest<HTMLElement>(".group-list");
    let destination: string | null = null;
    handle.setPointerCapture(pointerId);
    setDraggingId(groupId);
    const move = (moveEvent: globalThis.PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest<HTMLElement>("[data-group-id]");
      destination = target && list?.contains(target) && target.dataset.pinned === row?.dataset.pinned && target.dataset.groupId !== groupId
        ? target.dataset.groupId ?? null : null;
      setTargetId(destination);
      if (list) {
        const bounds = list.getBoundingClientRect();
        if (moveEvent.clientY < bounds.top + 28) list.scrollTop -= 16;
        if (moveEvent.clientY > bounds.bottom - 28) list.scrollTop += 16;
      }
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keyDown, true);
      if (handle.hasPointerCapture(pointerId)) handle.releasePointerCapture(pointerId);
      cleanupRef.current = null;
    };
    const reset = () => { cleanup(); setDraggingId(null); setTargetId(null); };
    const finish = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      if (destination) onMove(groupId, destination);
      reset();
    };
    const cancel = () => reset();
    const keyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") { keyEvent.preventDefault(); keyEvent.stopPropagation(); reset(); }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keyDown, true);
    cleanupRef.current = cleanup;
  };
  return { draggingId, targetId, start };
}
