import type { ReactNode } from "react";

export type SidePanelProps = {
  // Module class added next to `side-panel` so each feature can style its own panel.
  className: string;
  id: string;
  title: string;
  open: boolean;
  closeLabel: string;
  ariaLabel?: string;
  // PC only: docks the drawer to the right edge beside the workspace.
  pinned?: boolean;
  // Fills the browser viewport without entering the browser Fullscreen API.
  expanded?: boolean;
  onTogglePin?: () => void;
  // Extra header buttons shown before the pin and close buttons.
  headerActions?: ReactNode;
  onClose: () => void;
  children: ReactNode;
};
