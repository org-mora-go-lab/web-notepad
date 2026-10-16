import type { ReactNode } from "react";

export type SidePanelProps = {
  // Module class added next to `side-panel` so each feature can style its own panel.
  className: string;
  id: string;
  title: string;
  open: boolean;
  closeLabel: string;
  ariaLabel?: string;
  // Fills the browser viewport without entering the browser Fullscreen API.
  expanded?: boolean;
  // Extra header buttons shown before the close button.
  headerActions?: ReactNode;
  onClose: () => void;
  children: ReactNode;
};
