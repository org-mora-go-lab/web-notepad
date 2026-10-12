import { UNGROUPED_GROUP_ID } from "../constant";
import type { GroupEntry } from "../type";

const groupNameCollator = new Intl.Collator("ko", { sensitivity: "base" });
const koreanInitial = /^[ᄀ-ᇿ㄰-㆏가-힣]/u;

// Korean-initial names first, each ordered by Korean collation, with Ungrouped pinned last.
export function compareGroups(first: GroupEntry, second: GroupEntry) {
  const firstIsUngrouped = first.id === UNGROUPED_GROUP_ID;
  const secondIsUngrouped = second.id === UNGROUPED_GROUP_ID;
  if (firstIsUngrouped !== secondIsUngrouped) return firstIsUngrouped ? 1 : -1;
  const firstIsKorean = koreanInitial.test(first.name);
  const secondIsKorean = koreanInitial.test(second.name);
  if (firstIsKorean !== secondIsKorean) return firstIsKorean ? -1 : 1;
  return groupNameCollator.compare(first.name, second.name);
}
