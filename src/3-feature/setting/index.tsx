"use client";

import { useId } from "react";

import { FONT_SCALES, TAB_COLORS, useNotepadStore } from "@/src/4-entity/notepad";
import { LANGUAGE_LABELS, LANGUAGES } from "@/src/5-shared/constant";
import { useI18n } from "@/src/5-shared/hook";
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
  const languageTitleId = useId();
  const { language, t } = useI18n();
  const colorLabels = TAB_COLOR_LABELS[language];
  const settings = useNotepadStore((state) => state.settings);
  const setFontScale = useNotepadStore((state) => state.setFontScale);
  const setTabColorCycleColor = useNotepadStore((state) => state.setTabColorCycleColor);
  const setLanguage = useNotepadStore((state) => state.setLanguage);

  return (
    <SidePanel
      className="setting"
      id="settings-panel"
      title={t.settingsTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      closeLabel="설정 닫기"
      ariaLabel="설정"
      onClose={onClose}
    >
      <div className="setting-content">
        <section className="setting-section" aria-labelledby={fontTitleId}>
          <h3 id={fontTitleId}>{t.fontSize}</h3>
          <div className="setting-options" role="radiogroup" aria-labelledby={fontTitleId}>
            {FONT_SCALES.map((scale) => (
              <label key={scale} className="setting-option">
                <input
                  type="radio"
                  name={`${fontTitleId}-font-scale`}
                  checked={settings.fontScale === scale}
                  onChange={() => setFontScale(scale)}
                />
                <span>{Math.round(scale * 100)}%</span>
              </label>
            ))}
          </div>
        </section>
        <section className="setting-section" aria-labelledby={colorTitleId}>
          <h3 id={colorTitleId}>{t.tabColors}</h3>
          <p className="setting-hint">
            {t.tabColorHint}
            <br />
            ({settings.tabColorCycle.map((color) => colorLabels[color]).join(" → ")})
          </p>
          {settings.tabColorCycle.map((selected, index) => (
            <div className="setting-color-row" key={index}>
              <span className="setting-color-order">{index + 1}</span>
              <div className="setting-swatches" role="radiogroup" aria-label={t.tabColorGroup(index + 1)}>
                {TAB_COLORS.map((color) => (
                  <input
                    key={color}
                    className="setting-swatch"
                    type="radio"
                    name={`${colorTitleId}-tab-color-${index}`}
                    data-tab-color={color}
                    aria-label={colorLabels[color]}
                    title={colorLabels[color]}
                    checked={selected === color}
                    onChange={() => setTabColorCycleColor(index, color)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
        <section className="setting-section" aria-labelledby={languageTitleId}>
          <h3 id={languageTitleId}>{t.language}</h3>
          <div className="setting-options" role="radiogroup" aria-labelledby={languageTitleId}>
            {LANGUAGES.map((option) => (
              <label key={option} className="setting-option" lang={option}>
                <input
                  type="radio"
                  name={`${languageTitleId}-language`}
                  checked={language === option}
                  onChange={() => setLanguage(option)}
                />
                <span>{LANGUAGE_LABELS[option]}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
    </SidePanel>
  );
}
