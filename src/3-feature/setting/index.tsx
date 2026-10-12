"use client";

import { useId } from "react";

import { FONT_SCALES, TAB_COLORS, useNotepadStore } from "@/src/4-entity/notepad";
import { SidePanel } from "@/src/5-shared/ui";

import { TAB_COLOR_LABELS } from "./constant";

type Props = {
  open: boolean;
  pinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
};

export function Setting({ open, pinned, onTogglePin, onClose }: Props) {
  const fontTitleId = useId();
  const colorTitleId = useId();
  const settings = useNotepadStore((state) => state.settings);
  const setFontScale = useNotepadStore((state) => state.setFontScale);
  const setTabColorCycleColor = useNotepadStore((state) => state.setTabColorCycleColor);

  return (
    <SidePanel
      className="setting"
      id="settings-panel"
      title="Settings"
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="설정 닫기"
      ariaLabel="설정"
      onClose={onClose}
    >
      <div className="setting-content">
        <section className="setting-section" aria-labelledby={fontTitleId}>
          <h3 id={fontTitleId}>Font Size</h3>
          <div className="setting-font-scales" role="radiogroup" aria-labelledby={fontTitleId}>
            {FONT_SCALES.map((scale) => {
              const label = `${Math.round(scale * 100)}%`;
              return (
                <label key={scale} className="setting-font-scale">
                  <input
                    type="radio"
                    name={`${fontTitleId}-font-scale`}
                    checked={settings.fontScale === scale}
                    onChange={() => setFontScale(scale)}
                  />
                  <span>{label}</span>
                </label>
              );
            })}
          </div>
        </section>
        <section className="setting-section" aria-labelledby={colorTitleId}>
          <h3 id={colorTitleId}>Tab Colors</h3>
          <p className="setting-hint">
            New tabs start with the first color.
            <br />
            ({settings.tabColorCycle.map((color) => TAB_COLOR_LABELS[color]).join(" → ")})
          </p>
          {settings.tabColorCycle.map((selected, index) => {
            const groupLabel = `Tab color ${index + 1}`;
            return (
              <div className="setting-color-row" key={index}>
                <span className="setting-color-order">{index + 1}</span>
                <div className="setting-swatches" role="radiogroup" aria-label={groupLabel}>
                  {TAB_COLORS.map((color) => (
                    <input
                      key={color}
                      className="setting-swatch"
                      type="radio"
                      name={`${colorTitleId}-tab-color-${index}`}
                      data-tab-color={color}
                      aria-label={TAB_COLOR_LABELS[color]}
                      title={TAB_COLOR_LABELS[color]}
                      checked={selected === color}
                      onChange={() => setTabColorCycleColor(index, color)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </SidePanel>
  );
}
