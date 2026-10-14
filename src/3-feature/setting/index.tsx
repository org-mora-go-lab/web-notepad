"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { FONT_SCALES, useNotepadStore } from "@/src/4-entity/notepad";
import { LANGUAGE_LABELS, LANGUAGES } from "@/src/5-shared/constant";
import { useI18n } from "@/src/5-shared/hook";
import { ConfirmPopup, SidePanel } from "@/src/5-shared/ui";

import { RadioSetting, TabColorSetting } from "./component";
import type { SettingProps } from "./type";

export function Setting({ open, pinned, onTogglePin, onClose }: SettingProps) {
  const { language, t } = useI18n();
  const settings = useNotepadStore((state) => state.settings);
  const setFontScale = useNotepadStore((state) => state.setFontScale);
  const setLanguage = useNotepadStore((state) => state.setLanguage);
  const setPanelPosition = useNotepadStore((state) => state.setPanelPosition);
  const setPanelSlide = useNotepadStore((state) => state.setPanelSlide);
  const resetSettings = useNotepadStore((state) => state.resetSettings);
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
          aria-label={t.resetSettings}
          title={t.resetSettings}
        >
          <RotateCcw size={14} />
        </button>
      }
      closeLabel={t.closePanel(t.settingsTitle)}
      ariaLabel={t.settingsTitle}
      onClose={onClose}
    >
      <div className="setting-content">
        <RadioSetting
          title={t.fontSize}
          name="font-scale"
          value={settings.fontScale}
          onChange={setFontScale}
          options={FONT_SCALES.map((value) => ({
            value,
            label: Math.round(value * 100) + "%",
          }))}
        />
        <TabColorSetting />
        <RadioSetting
          title={t.language}
          name="language"
          value={language}
          onChange={setLanguage}
          options={LANGUAGES.map((value) => ({
            value,
            label: LANGUAGE_LABELS[value],
            language: value,
          }))}
        />
        <RadioSetting
          title={t.panelSlide}
          name="panel-slide"
          value={settings.panelSlide}
          onChange={setPanelSlide}
          options={[
            { value: true, label: t.on },
            { value: false, label: t.off },
          ]}
        />
        <RadioSetting
          title={t.panelPosition}
          name="panel-position"
          value={settings.panelPosition}
          onChange={setPanelPosition}
          options={[
            { value: "left", label: t.panelLeft },
            { value: "right", label: t.panelRight },
          ]}
        />
      </div>
      {confirmingReset && (
        <ConfirmPopup
          title={t.resetSettings}
          message={t.resetSettingsMessage}
          closeLabel={t.closePanel(t.resetSettings)}
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
