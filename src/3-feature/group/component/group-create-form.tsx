"use client";

import { Plus } from "lucide-react";
import { type FormEvent, useState } from "react";

import { useI18n } from "@/src/5-shared/hook";

type Props = {
  onCreate: (name: string) => void;
};

// One-line "new group" row: type a name and press Enter or the + button.
export function GroupCreateForm({ onCreate }: Props) {
  const { t } = useI18n();
  const [name, setName] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;
    onCreate(trimmedName);
    setName("");
  };

  return (
    <form className="group-create-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={t.groupName}
        aria-label="새 그룹 이름"
        maxLength={60}
      />
      <button type="submit" aria-label="그룹 생성" title={t.createGroup} disabled={!name.trim()}>
        <Plus size={16} />
      </button>
    </form>
  );
}
