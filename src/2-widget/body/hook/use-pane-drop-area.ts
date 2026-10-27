"use client";

import { type DragEvent as ReactDragEvent, useState } from "react";

export function usePaneDropArea(
  dragActive: boolean,
  onDrop: (event: ReactDragEvent<HTMLDivElement>) => void,
) {
  const [dropAreaHovered, setDropAreaHovered] = useState(false);
  // Whether the dragged tab is below the vertical middle of the pane body.
  const [pointerInLowerHalf, setPointerInLowerHalf] = useState(false);

  const handleDragEnter = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragActive) return;
    event.preventDefault();
    setDropAreaHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPointerInLowerHalf(event.clientY - rect.top > rect.height / 2);
  };

  const handleDragLeave = (event: ReactDragEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget))
      return;
    setDropAreaHovered(false);
  };

  const handleDragOver = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragActive) return;
    event.preventDefault();
    // Native dragleave can fire as overlays replace the element under the pointer.
    setDropAreaHovered(true);
    const rect = event.currentTarget.getBoundingClientRect();
    setPointerInLowerHalf(event.clientY - rect.top > rect.height / 2);
  };

  const handleDrop = (event: ReactDragEvent<HTMLDivElement>) => {
    if (!dragActive) return;
    event.preventDefault();
    setDropAreaHovered(false);
    onDrop(event);
  };

  return {
    dropAreaHovered,
    pointerInLowerHalf,
    clearDropAreaHovered: () => setDropAreaHovered(false),
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
}
