"use client";

import { Fragment } from "react";

import type { PaneColumnProps } from "../../type";
import { PaneDivider } from "./pane-divider";
import { PaneView } from "./pane-view";

export function PaneColumn({
  column,
  panes,
  widthRatio,
  rowRatio,
  onResize,
  onRowResize,
}: PaneColumnProps) {
  const stacked = panes.length > 1;

  return (
    <>
      {onResize && <PaneDivider onResize={onResize} />}
      <div
        className={`pane-column ${stacked ? "is-stacked" : ""}`}
        data-column={column}
        style={widthRatio ? { flex: `0 0 ${widthRatio * 100}%` } : undefined}
      >
        {panes.map((pane, index) => (
          <Fragment key={pane.pane}>
            {index > 0 && (
              <PaneDivider orientation="horizontal" onResize={onRowResize} />
            )}
            <PaneView
              {...pane}
              heightRatio={stacked && index === 0 ? rowRatio : undefined}
            />
          </Fragment>
        ))}
      </div>
    </>
  );
}
