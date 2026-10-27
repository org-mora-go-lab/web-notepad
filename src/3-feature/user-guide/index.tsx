"use client";

import { BookOpen, ChevronLeft, ChevronRight, Keyboard, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

import { useGuideSteps } from "./hook";
import type { UserGuideProps } from "./type";

// Modal walkthrough: one step at a time with Previous/Next, closed by the header button or Escape.
export function UserGuide({ onClose, onOpenShortcuts }: UserGuideProps) {
  const { language, t } = useI18n();
  const steps = useGuideSteps(language);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const guideId = useId();
  const currentIndex = Math.min(index, steps.length - 1);
  const step = steps[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === steps.length - 1;

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
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div className="user-guide-header">
        <div className="user-guide-heading">
          <BookOpen size={18} aria-hidden="true" />
          <h3>{t.userGuideTitle}</h3>
        </div>
        <div className="user-guide-header-actions">
          <span className="user-guide-progress" aria-live="polite">
            {currentIndex + 1} / {steps.length}
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
      <div className="user-guide-description" id={`${guideId}-description`}>
        <p>{step.description}</p>
        {step.shortcutEntry && (
          <button
            className="user-guide-shortcut"
            type="button"
            onClick={onOpenShortcuts}
          >
            <Keyboard aria-hidden="true" />
            <span>{t.shortcut}</span>
          </button>
        )}
      </div>
      <div className="user-guide-actions">
        <div className="user-guide-nav">
          <button
            className="user-guide-prev"
            type="button"
            disabled={isFirst}
            onClick={() => setIndex(currentIndex - 1)}
          >
            <ChevronLeft size={14} aria-hidden="true" />
            <span>{t.previous}</span>
          </button>
          {/* The last step turns Next into Close in the same spot, keeping focus. */}
          <button
            className={isLast ? "user-guide-close" : "user-guide-next"}
            ref={nextButtonRef}
            type="button"
            onClick={() => (isLast ? close() : setIndex(currentIndex + 1))}
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
