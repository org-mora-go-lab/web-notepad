import type { Language } from "@/src/5-shared/type";

export type RadioSettingValue = string | number | boolean;

export type RadioSettingProps<T extends RadioSettingValue> = {
  title: string;
  name: string;
  value: T;
  options: { value: T; label: string; language?: Language }[];
  onChange: (value: T) => void;
};
