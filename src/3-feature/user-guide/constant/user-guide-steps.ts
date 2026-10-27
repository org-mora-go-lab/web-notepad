import type { Language } from "@/src/5-shared/type";

export type UserGuideStep = {
  title: string;
  description: string;
  shortcutEntry?: boolean;
};

// Eleven steps shown one at a time in the user guide popup.
export const USER_GUIDE_STEPS: Record<Language, readonly UserGuideStep[]> = {
  en: [
    {
      title: "Keyboard shortcuts",
      description:
        "Open the shortcut panel to see every keyboard command available while editing.",
      shortcutEntry: true,
    },
    {
      title: "Write notes",
      description:
        "Type in the editor and your note is saved in this browser automatically.",
    },
    {
      title: "Add tabs",
      description:
        "Press + next to the tabs to add a new tab, and click a tab to switch to it.",
    },
    {
      title: "Tab colors",
      description:
        "Click the square icon on a tab to cycle its color in the order set in Settings.",
    },
    {
      title: "Tab menu",
      description:
        "Right-click a tab on PC or double-tap it on mobile to bookmark or move it to another group.",
    },
    {
      title: "Select lines",
      description:
        "Click a line number to highlight that line. Selected lines are kept with the tab.",
    },
    {
      title: "Groups",
      description:
        "Press the group name or GROUP at the bottom to create, rename and switch groups.",
    },
    {
      title: "Bookmarks",
      description:
        "Choose Bookmark from the bottom-right More menu to see the current group's bookmarked tabs and open them again.",
    },
    {
      title: "Search and closed tabs",
      description:
        "Use SEARCH at the bottom to search everything, and the dashboard to restore closed tabs.",
    },
    {
      title: "Theme and settings",
      description:
        "After login, open Settings from your account menu to change theme, font size, tab colors and language.",
    },
    {
      title: "Panels beside the editor",
      description:
        "On PC, panels stay open beside the editor while you write. Close them with X.",
    },
  ],
  ko: [
    {
      title: "키보드 단축키",
      description:
        "단축키 패널을 열어 편집 중 사용할 수 있는 모든 키보드 명령을 확인하세요.",
      shortcutEntry: true,
    },
    {
      title: "메모 작성",
      description:
        "편집기에 입력하면 내용이 이 브라우저에 자동으로 저장됩니다.",
    },
    {
      title: "탭 추가",
      description: "탭 옆의 + 버튼으로 새 탭을 추가하고, 탭을 눌러 전환합니다.",
    },
    {
      title: "탭 색상",
      description:
        "탭의 네모 아이콘을 누르면 설정한 순서대로 탭 색상이 바뀝니다.",
    },
    {
      title: "탭 메뉴",
      description:
        "PC에서는 탭을 우클릭, 모바일에서는 두 번 탭해 북마크·그룹 이동을 할 수 있습니다.",
    },
    {
      title: "줄 선택",
      description:
        "줄 번호를 누르면 해당 줄을 강조합니다. 선택한 줄은 탭과 함께 저장됩니다.",
    },
    {
      title: "그룹",
      description:
        "하단의 그룹 이름이나 그룹 버튼을 눌러 그룹을 만들고 이름을 바꾸거나 전환합니다.",
    },
    {
      title: "북마크",
      description:
        "하단의 북마크를 눌러 북마크한 탭을 확인하고 다시 열 수 있습니다.",
    },
    {
      title: "검색과 닫은 탭",
      description:
        "하단의 검색으로 전체 내용을 찾고, 대시보드에서 닫았던 탭을 복원합니다.",
    },
    {
      title: "테마와 설정",
      description:
        "테마에서 다크·라이트를 고르고, 설정에서 폰트 크기·탭 색상·언어를 바꿉니다.",
    },
    {
      title: "편집기 옆 패널",
      description:
        "PC에서는 패널이 항상 편집기 옆에 고정됩니다. X 버튼으로 닫을 수 있습니다.",
    },
  ],
};
