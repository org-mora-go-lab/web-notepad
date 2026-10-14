import { useId } from "react";

import type { Language } from "@/src/5-shared/type";

type Value = string | number | boolean;
type Props<T extends Value> = {
  title: string;
  name: string;
  value: T;
  options: { value: T; label: string; language?: Language }[];
  onChange: (value: T) => void;
};

export function RadioSetting<T extends Value>({
  title,
  name,
  value,
  options,
  onChange,
}: Props<T>) {
  const titleId = useId();
  return (
    <section className="setting-section" aria-labelledby={titleId}>
      <h3 id={titleId}>{title}</h3>
      <div
        className="setting-options"
        role="radiogroup"
        aria-labelledby={titleId}
      >
        {options.map((option) => (
          <label
            key={String(option.value)}
            className="setting-option"
            lang={option.language}
          >
            <input
              type="radio"
              name={titleId + "-" + name}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
