import { RotateCcw } from "lucide-react";
import { useId, useState } from "react";

import {
  DASHBOARD_STATUSES,
  type DashboardStatusNames,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";

export function DashboardStatusDefaultSetting() {
  const { t } = useI18n();
  const titleId = useId();
  const defaults = useNotepadStore(
    (state) => state.settings.dashboardStatusDefaults,
  );
  const saveDefaults = useNotepadStore(
    (state) => state.setDashboardStatusDefaults,
  );
  const [draft, setDraft] = useState<DashboardStatusNames | null>(null);
  const [saved, setSaved] = useState(false);
  const labels = {
    icebox: t.icebox,
    todo: t.statusTodo,
    ready: t.statusReady,
    "in-progress": t.statusInProgress,
    done: t.statusDone,
    closed: t.closedTitle,
  };
  return (
    <section
      className="setting-section setting-status-defaults"
      aria-labelledby={titleId}
    >
      <div className="setting-section-heading">
        <h3 id={titleId}>{t.defaultStatusNames}</h3>
        <button
          type="button"
          className="setting-section-reset"
          aria-label={t.resetDefaultStatusNames}
          title={t.resetDefaultStatusNames}
          onClick={() => {
            saveDefaults({});
            setDraft(null);
            setSaved(false);
          }}
        >
          <RotateCcw size={13} />
        </button>
      </div>
      <p className="setting-hint">{t.defaultStatusNamesHint}</p>
      <form
        aria-labelledby={titleId}
        onSubmit={(event) => {
          event.preventDefault();
          saveDefaults(draft ?? defaults);
          setDraft(null);
          setSaved(true);
        }}
      >
        {DASHBOARD_STATUSES.map((status) => (
          <label key={status}>
            <span>{labels[status]}</span>
            <input
              maxLength={30}
              placeholder={labels[status]}
              value={(draft ?? defaults)[status] ?? ""}
              onChange={(event) => {
                setSaved(false);
                setDraft({
                  ...(draft ?? defaults),
                  [status]: event.target.value,
                });
              }}
            />
          </label>
        ))}
        <div className="setting-status-default-actions">
          <output aria-live="polite">{saved ? t.saved : ""}</output>
          <button type="submit" disabled={draft === null}>
            {t.save}
          </button>
        </div>
      </form>
    </section>
  );
}
