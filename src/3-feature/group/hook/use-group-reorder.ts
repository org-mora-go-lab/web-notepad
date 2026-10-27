import { type PointerEvent, useEffect, useRef, useState } from "react";

const DRAG_START_DISTANCE = 6;

export function useGroupReorder(
  onMove: (groupId: string, targetId: string) => void,
) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanupRef.current?.(), []);

  const start = (groupId: string, event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    cleanupRef.current?.();
    const handle = event.currentTarget;
    const pointerId = event.pointerId;
    const row = handle.closest<HTMLElement>("[data-group-id]");
    const list = handle.closest<HTMLElement>(".group-list");
    const section = handle.closest<HTMLElement>(".group-section-list") ?? list;
    const startX = event.clientX;
    const startY = event.clientY;
    let active = false;
    let destination: string | null = null;
    const move = (moveEvent: globalThis.PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      if (
        !active &&
        Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) <
          DRAG_START_DISTANCE
      )
        return;
      if (!active) {
        active = true;
        if (row) row.dataset.reorderDragged = "true";
        handle.setPointerCapture(pointerId);
        setDraggingId(groupId);
      }
      moveEvent.preventDefault();
      const target = document
        .elementFromPoint(moveEvent.clientX, moveEvent.clientY)
        ?.closest<HTMLElement>("[data-group-id]");
      destination =
        target &&
        section?.contains(target) &&
        target.dataset.pinned === row?.dataset.pinned &&
        target.dataset.groupId !== groupId
          ? (target.dataset.groupId ?? null)
          : null;
      setTargetId(destination);
      if (section) {
        const bounds = section.getBoundingClientRect();
        if (moveEvent.clientY < bounds.top + 28) section.scrollTop -= 16;
        if (moveEvent.clientY > bounds.bottom - 28) section.scrollTop += 16;
      }
    };
    const cleanup = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", finish);
      window.removeEventListener("pointercancel", cancel);
      window.removeEventListener("keydown", keyDown, true);
      if (handle.hasPointerCapture(pointerId))
        handle.releasePointerCapture(pointerId);
      cleanupRef.current = null;
    };
    const reset = () => {
      cleanup();
      setDraggingId(null);
      setTargetId(null);
    };
    const finish = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId !== pointerId) return;
      if (active && destination) onMove(groupId, destination);
      reset();
      window.setTimeout(() => {
        if (row) delete row.dataset.reorderDragged;
      }, 0);
    };
    const cancel = () => reset();
    const keyDown = (keyEvent: KeyboardEvent) => {
      if (keyEvent.key === "Escape") {
        keyEvent.preventDefault();
        keyEvent.stopPropagation();
        reset();
      }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", finish);
    window.addEventListener("pointercancel", cancel);
    window.addEventListener("keydown", keyDown, true);
    cleanupRef.current = cleanup;
  };
  return { draggingId, targetId, start };
}
