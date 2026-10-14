"use client";

import { Search } from "lucide-react";

import type { SearchFieldProps } from "./type";

export function SearchField({
  value,
  ariaLabel,
  placeholder,
  onChange,
}: SearchFieldProps) {
  return (
    <label className="search-field">
      <Search size={15} aria-hidden="true" />
      <input
        type="search"
        value={value}
        aria-label={ariaLabel}
        placeholder={placeholder}
        autoComplete="off"
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
