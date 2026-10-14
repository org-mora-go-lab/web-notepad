import { useId } from "react";

import type { RadioSettingProps, RadioSettingValue } from "../type";

export function RadioSetting<T extends RadioSettingValue>({
  title,
  name,
  value,
  options,
  onChange,
}: RadioSettingProps<T>) {
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
