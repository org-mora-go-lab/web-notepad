import type { Language } from "@/src/5-shared/type";

export type UserGuideStep = {
  title: string;
  description: string;
};

// Ten steps shown one at a time in the user guide popup.
export const USER_GUIDE_STEPS: Record<Language, readonly UserGuideStep[]> = {
  en: [
    {
      title: "Write notes",
      description: "Type in the editor and your note is saved in this browser automatically.",
    },
    {
      title: "Add tabs",
      description: "Press + next to the tabs to add a new tab, and click a tab to switch to it.",
    },
    {
      title: "Tab colors",
      description: "Click the square icon on a tab to cycle its color in the order set in Settings.",
    },
    {
      title: "Tab menu",
      description: "Right-click a tab on PC or double-tap it on mobile to pin, bookmark or move it to another group.",
    },
    {
      title: "Select lines",
      description: "Click a line number to highlight that line. Selected lines are kept with the tab.",
    },
    {
      title: "Groups",
      description: "Press the group name or GROUP at the bottom to create, rename and switch groups.",
    },
    {
      title: "Bookmarks",
      description: "Press BOOKMARK at the bottom to see bookmarked tabs and open them again.",
    },
    {
      title: "Search and closed tabs",
      description: "Use SEARCH at the bottom to search everything, and the dashboard to restore closed tabs.",
    },
    {
      title: "Theme and settings",
      description: "Choose DARK or LIGHT in THEME, and change font size, tab colors and language in SETTINGS.",
    },
    {
      title: "Pin panels",
      description: "On PC, pin a right panel to keep it open beside the editor while you write.",
    },
  ],
  ko: [
    {
      title: "메모 작성",
      description: "편집기에 입력하면 내용이 이 브라우저에 자동으로 저장됩니다.",
    },
    {
      title: "탭 추가",
      description: "탭 옆의 + 버튼으로 새 탭을 추가하고, 탭을 눌러 전환합니다.",
    },
    {
      title: "탭 색상",
      description: "탭의 네모 아이콘을 누르면 설정한 순서대로 탭 색상이 바뀝니다.",
    },
    {
      title: "탭 메뉴",
      description: "PC에서는 탭을 우클릭, 모바일에서는 두 번 탭해 고정·북마크·그룹 이동을 할 수 있습니다.",
    },
    {
      title: "줄 선택",
      description: "줄 번호를 누르면 해당 줄을 강조합니다. 선택한 줄은 탭과 함께 저장됩니다.",
    },
    {
      title: "그룹",
      description: "하단의 그룹 이름이나 그룹 버튼을 눌러 그룹을 만들고 이름을 바꾸거나 전환합니다.",
    },
    {
      title: "북마크",
      description: "하단의 북마크를 눌러 북마크한 탭을 확인하고 다시 열 수 있습니다.",
    },
    {
      title: "검색과 닫은 탭",
      description: "하단의 검색으로 전체 내용을 찾고, 대시보드에서 닫았던 탭을 복원합니다.",
    },
    {
      title: "테마와 설정",
      description: "테마에서 다크·라이트를 고르고, 설정에서 폰트 크기·탭 색상·언어를 바꿉니다.",
    },
    {
      title: "패널 고정",
      description: "PC에서는 우측 패널을 고정해 편집기 옆에 띄워 둔 채로 작성할 수 있습니다.",
    },
  ],
};
