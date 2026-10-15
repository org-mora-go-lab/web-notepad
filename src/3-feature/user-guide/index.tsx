"use client";

import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import { USER_GUIDE_STEPS } from "./constant";
import type { UserGuideProps } from "./type";

// Modal walkthrough: one step at a time with Previous/Next, closed by the header button or Escape.
export function UserGuide({ onClose }: UserGuideProps) {
  const { language, t } = useI18n();
  const steps = USER_GUIDE_STEPS[language];
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const guideId = useId();
  const step = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    nextButtonRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  const close = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      className="user-guide"
      ref={dialogRef}
      aria-labelledby={`${guideId}-title`}
      aria-describedby={`${guideId}-description`}
      onKeyDown={(event) => event.stopPropagation()}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className="user-guide-header">
        <div className="user-guide-heading">
          <BookOpen size={18} aria-hidden="true" />
          <h3>{t.userGuideTitle}</h3>
        </div>
        <div className="user-guide-header-actions">
          <span className="user-guide-progress" aria-live="polite">
            {index + 1} / {steps.length}
          </span>
          <button
            className="user-guide-stop"
            type="button"
            aria-label={t.userGuideStop}
            onClick={close}
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      </div>
      <h4 id={`${guideId}-title`}>{step.title}</h4>
      <p id={`${guideId}-description`}>{step.description}</p>
      <div className="user-guide-actions">
        <div className="user-guide-nav">
          <button
            className="user-guide-prev"
            type="button"
            disabled={isFirst}
            onClick={() => setIndex(index - 1)}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            <span>{t.previous}</span>
          </button>
          {/* The last step turns Next into Close in the same spot, keeping focus. */}
          <button
            className={isLast ? "user-guide-close" : "user-guide-next"}
            ref={nextButtonRef}
            type="button"
            onClick={() => (isLast ? close() : setIndex(index + 1))}
          >
            <span>{isLast ? t.close : t.next}</span>
            {isLast ? (
              <X size={14} aria-hidden="true" />
            ) : (
              <ChevronRight size={14} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
}
