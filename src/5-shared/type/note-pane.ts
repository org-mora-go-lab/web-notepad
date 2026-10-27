export type PaneDropZone = {
  key: string;
  label: string;
  // Part of the pane the zone covers; "full" when omitted.
  area?: "full" | "left" | "right" | "bottom";
  onDrop: () => void;
};
