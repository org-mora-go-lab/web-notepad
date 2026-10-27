import { RotateCcw, Shuffle } from "lucide-react";
import { useId } from "react";

import { TAB_COLORS, useNotepadStore } from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

import { TAB_COLOR_LABELS } from "../constant";

export function TabColorSetting() {
  const colorTitleId = useId();
  const { language, t } = useI18n();
  const colorLabels = TAB_COLOR_LABELS[language];
  const settings = useNotepadStore((state) => state.settings);
  const setTabColorCycleColor = useNotepadStore(
    (state) => state.setTabColorCycleColor,
  );
  const resetTabColorCycle = useNotepadStore(
    (state) => state.resetTabColorCycle,
  );
  const shuffleTabColorCycle = useNotepadStore(
    (state) => state.shuffleTabColorCycle,
  );
  const statusLabels = [t.statusTodo, t.statusReady, t.statusInProgress];
  return (
    <section className="setting-section" aria-labelledby={colorTitleId}>
      <div className="setting-section-heading">
        <h3 id={colorTitleId}>{t.tabColors}</h3>
        <button
          className="setting-section-reset"
          type="button"
          onClick={resetTabColorCycle}
          aria-label={t.resetTabColors}
          title={t.resetTabColors}
        >
          <RotateCcw size={13} />
        </button>
        <button
          className="setting-section-reset"
          type="button"
          onClick={shuffleTabColorCycle}
          aria-label={t.shuffleTabColors}
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
                {statusLabels[index]} · {colorLabels[color]}
              </span>
            </span>
          ))}
        </span>
      </p>
      {settings.tabColorCycle.map((selected, index) => (
        <div className="setting-color-row" key={index}>
          <span
            className="setting-color-status"
            id={`${colorTitleId}-status-${index}`}
          >
            {statusLabels[index]}
          </span>
          <div
            className="setting-swatches"
            role="radiogroup"
            aria-describedby={`${colorTitleId}-status-${index}`}
            aria-label={t.tabColorGroup(index + 1)}
          >
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
                disabled={settings.tabColorCycle
                  .slice(0, index)
                  .includes(color)}
                onChange={() => setTabColorCycleColor(index, color)}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
