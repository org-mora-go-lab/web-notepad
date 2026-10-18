"use client";

import { Search } from "lucide-react";

import { Auth } from "@/src/3-feature";
import { useI18n } from "@/src/5-shared/hook";

import type { AdditionalToolsProps } from "../type";

export function AdditionalTools({
  onToggleSearch,
  searchOpen,
}: AdditionalToolsProps) {
  const { t } = useI18n();

  return (
    <div className="additional-tools">
      <Auth />
      <button
        className={`global-search-command ${searchOpen ? "is-active" : ""}`}
        type="button"
        title={t.search}
        aria-label={t.search}
        aria-expanded={searchOpen}
        aria-controls="global-search-popup"
        aria-haspopup="dialog"
        onClick={onToggleSearch}
      >
        <Search strokeWidth={1.8} />
      </button>
    </div>
  );
}
