"use client";

import "./style.scss";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type FixedPageHeaderProps = {
  backLabel: string;
  className?: string;
  onBack?: () => void;
  onNavigateBack?: () => void;
  title: string;
};

export function FixedPageHeader({
  backLabel,
  className = "",
  onBack,
  onNavigateBack,
  title,
}: FixedPageHeaderProps) {
  const backContent = (
    <>
      <ChevronLeft size={18} aria-hidden="true" />
      <span>{backLabel}</span>
    </>
  );

  return (
    <>
      <header className={`fixed-page-header ${className}`.trim()}>
        {onBack ? (
          <button
            type="button"
            className="fixed-page-header-back board-back"
            onClick={onBack}
          >
            {backContent}
          </button>
        ) : (
          <Link
            className="fixed-page-header-back"
            href="/"
            onClick={onNavigateBack}
          >
            {backContent}
          </Link>
        )}
        <h1>{title}</h1>
      </header>
      <div className="fixed-page-header-spacer" aria-hidden="true" />
    </>
  );
}
