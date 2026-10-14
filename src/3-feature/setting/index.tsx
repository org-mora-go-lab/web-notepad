"use client";

import { RotateCcw, Shuffle } from "lucide-react";
import { useId, useState } from "react";

import { FONT_SCALES, TAB_COLORS, useNotepadStore } from "@/src/4-entity/notepad";
import { LANGUAGE_LABELS, LANGUAGES } from "@/src/5-shared/constant";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SidePanel } from "@/src/5-shared/ui";

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
  const slideTitleId = useId();
  const positionTitleId = useId();
  const { language, t } = useI18n();
  const colorLabels = TAB_COLOR_LABELS[language];
  const settings = useNotepadStore((state) => state.settings);
  const setFontScale = useNotepadStore((state) => state.setFontScale);
  const setTabColorCycleColor = useNotepadStore((state) => state.setTabColorCycleColor);
  const setLanguage = useNotepadStore((state) => state.setLanguage);
  const setPanelPosition = useNotepadStore((state) => state.setPanelPosition);
  const setPanelSlide = useNotepadStore((state) => state.setPanelSlide);
  const resetSettings = useNotepadStore((state) => state.resetSettings);
  const resetTabColorCycle = useNotepadStore((state) => state.resetTabColorCycle);
  const shuffleTabColorCycle = useNotepadStore((state) => state.shuffleTabColorCycle);
  const [confirmingReset, setConfirmingReset] = useState(false);

  return (
    <SidePanel
      className="setting"
      id="settings-panel"
      title={t.settingsTitle}
      open={open}
      pinned={pinned}
      onTogglePin={onTogglePin}
      headerActions={
        <button
          className="side-panel-action setting-reset"
          type="button"
          onClick={() => setConfirmingReset(true)}
          aria-label="설정 초기화"
          title={t.resetSettings}
        >
          <RotateCcw size={14} />
        </button>
      }
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
          <div className="setting-section-heading">
            <h3 id={colorTitleId}>{t.tabColors}</h3>
            <button
              className="setting-section-reset"
              type="button"
              onClick={resetTabColorCycle}
              aria-label="탭 색상 초기화"
              title={t.resetTabColors}
            >
              <RotateCcw size={13} />
            </button>
            <button
              className="setting-section-reset"
              type="button"
              onClick={shuffleTabColorCycle}
              aria-label="탭 색상 무작위 선택"
              title={t.shuffleTabColors}
            >
              <Shuffle size={13} />
            </button>
          </div>
          <p className="setting-hint">
            <span className="setting-hint-text">{t.tabColorHint}</span>
            <span className="setting-color-guide">
              {settings.tabColorCycle.map((color, index) => (
                <span key={color}>
                  {index > 0 && " → "}
                  <span className="setting-color-chip" data-tab-color={color}>
                    {colorLabels[color]}
                  </span>
                </span>
              ))}
            </span>
          </p>
          {settings.tabColorCycle.map((selected, index) => (
            <div className="setting-color-row" key={index}>
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
                    // Colors already used by an earlier slot are locked here.
                    disabled={settings.tabColorCycle.slice(0, index).includes(color)}
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
        <section className="setting-section" aria-labelledby={slideTitleId}>
          <h3 id={slideTitleId}>{t.panelSlide}</h3>
          <div className="setting-options" role="radiogroup" aria-labelledby={slideTitleId}>
            {[true, false].map((option) => (
              <label key={String(option)} className="setting-option">
                <input
                  type="radio"
                  name={`${slideTitleId}-panel-slide`}
                  checked={settings.panelSlide === option}
                  onChange={() => setPanelSlide(option)}
                />
                <span>{option ? t.on : t.off}</span>
              </label>
            ))}
          </div>
        </section>
        <section className="setting-section" aria-labelledby={positionTitleId}>
          <h3 id={positionTitleId}>{t.panelPosition}</h3>
          <div className="setting-options" role="radiogroup" aria-labelledby={positionTitleId}>
            {(["left", "right"] as const).map((position) => (
              <label key={position} className="setting-option">
                <input type="radio" name={`${positionTitleId}-panel-position`} checked={settings.panelPosition === position} onChange={() => setPanelPosition(position)} />
                <span>{position === "left" ? t.panelLeft : t.panelRight}</span>
              </label>
            ))}
          </div>
        </section>
      </div>
      {confirmingReset && (
        <ConfirmPopup
          title={t.resetSettings}
          message={t.resetSettingsMessage}
          closeLabel="초기화 확인 닫기"
          closeTitle={t.close}
          confirmLabel={t.reset}
          confirmIcon={<RotateCcw size={14} aria-hidden="true" />}
          onCancel={() => setConfirmingReset(false)}
          onConfirm={() => {
            resetSettings();
            setConfirmingReset(false);
          }}
        />
      )}
    </SidePanel>
  );
}
