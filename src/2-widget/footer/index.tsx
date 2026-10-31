"use client";

import {
  Bookmark,
  BookOpen,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Auth } from "@/src/3-feature";
import {
  ALL_GROUP_ID,
  ALL_MY_GROUP_ID,
  ALL_SHARED_GROUP_ID,
  CORE_FOOTER_ITEM_IDS,
  UNGROUPED_GROUP_ID,
  useNotepadStore,
} from "@/src/4-entity/notepad";
import { useI18n } from "@/src/5-shared/hook";
import {
  FOOTER_PIN_REQUEST_EVENT,
  type FooterPinRequestDetail,
} from "@/src/5-shared/util";

import type { FooterProps } from "./type";

const CORE_ITEMS = new Set<string>(CORE_FOOTER_ITEM_IDS);

export function Footer({
  hasGroupUpdateToday,
  dashboardOpen,
  activeGroupName,
  groupsOpen,
  groups = [],
  onSwipeTabs,
  onToggleDashboard,
  onToggleGroups,
  onSelectGroup = () => undefined,
  onOpenGuide = () => undefined,
  onOpenSettings = () => undefined,
  onToggleBookmarks = () => undefined,
  onToggleSearch = () => undefined,
}: FooterProps) {
  const { t } = useI18n();
  const router = useRouter();
  const footerItems = useNotepadStore((state) => state.settings.footerItems);
  const iconsOnly = useNotepadStore((state) => state.settings.footerIconsOnly);
  const setFooterItems = useNotepadStore((state) => state.setFooterItems);
  const [pinMenu, setPinMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const draggingItem = useRef<string | null>(null);
  const swipeStart = useRef<{
    x: number;
    y: number;
    pointerId: number;
    target: Element;
  } | null>(null);
  const swipeClickGuard = useRef<{
    target: Element;
    expiresAt: number;
  } | null>(null);

  useEffect(() => {
    const requestPin = (event: Event) => {
      const detail = (event as CustomEvent<FooterPinRequestDetail>).detail;
      if (!detail?.id || CORE_ITEMS.has(detail.id)) return;
      setPinMenu({ id: detail.id, x: detail.x, y: detail.y });
    };
    const close = () => setPinMenu(null);
    const closeOnKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener(FOOTER_PIN_REQUEST_EVENT, requestPin);
    window.addEventListener("resize", close);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", closeOnKey);
    return () => {
      window.removeEventListener(FOOTER_PIN_REQUEST_EVENT, requestPin);
      window.removeEventListener("resize", close);
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", closeOnKey);
    };
  }, []);

  const groupLabel = (groupId: string) => {
    if (groupId === ALL_GROUP_ID) return t.allGroup;
    if (groupId === ALL_MY_GROUP_ID) return t.allMyGroup;
    if (groupId === ALL_SHARED_GROUP_ID) return t.allSharedGroup;
    if (groupId === UNGROUPED_GROUP_ID) return t.ungrouped;
    return groups.find((group) => group.id === groupId)?.name ?? groupId;
  };

  const itemDetails = (id: string) => {
    if (id.startsWith("group:"))
      return {
        label: groupLabel(id.slice("group:".length)),
        Icon: Layers,
      };
    const details = {
      "action:guide": { label: t.guide, Icon: BookOpen },
      "action:search": { label: t.search, Icon: Search },
      "action:bookmarks": { label: t.bookmark, Icon: Bookmark },
      "action:settings": { label: t.settings, Icon: Settings },
      "account:logout": { label: t.logout, Icon: LogOut },
      "account:my-page": { label: t.myPage, Icon: UserRound },
      "account:board": { label: t.board, Icon: MessageSquare },
    } as const;
    return details[id as keyof typeof details] ?? null;
  };

  const activateItem = async (id: string) => {
    if (id.startsWith("group:")) {
      onSelectGroup(id.slice("group:".length));
      return;
    }
    if (id === "action:guide") onOpenGuide();
    else if (id === "action:search") onToggleSearch();
    else if (id === "action:bookmarks") onToggleBookmarks();
    else if (id === "action:settings") onOpenSettings();
    else if (id === "account:my-page") router.push("/my-page");
    else if (id === "account:board") router.push("/board");
    else if (id === "account:logout") {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) window.dispatchEvent(new Event("notepad-auth-changed"));
    }
  };

  const moveItem = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const next = footerItems.filter((id) => id !== fromId);
    const targetIndex = next.indexOf(toId);
    next.splice(targetIndex < 0 ? next.length : targetIndex, 0, fromId);
    setFooterItems(next);
  };

  const itemFrame = (id: string, content: ReactNode) => (
    <div
      key={id}
      className={`footer-dock-item ${CORE_ITEMS.has(id) ? "is-core" : "is-custom"} ${id.replace(":", "-")}`}
      data-footer-item={id}
      draggable
      onDragStart={(event) => {
        if (window.matchMedia("(max-width: 512px)").matches) {
          event.preventDefault();
          return;
        }
        draggingItem.current = id;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      }}
      onDragOver={(event) => {
        if (!draggingItem.current) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        const fromId =
          draggingItem.current || event.dataTransfer.getData("text/plain");
        draggingItem.current = null;
        if (fromId) moveItem(fromId, id);
      }}
      onDragEnd={() => {
        draggingItem.current = null;
      }}
      onContextMenu={(event) => {
        if (
          CORE_ITEMS.has(id) ||
          window.matchMedia("(max-width: 512px)").matches
        )
          return;
        event.preventDefault();
        setPinMenu({ id, x: event.clientX, y: event.clientY });
      }}
    >
      {content}
    </div>
  );

  const renderItem = (id: string) => {
    if (id === "core:groups")
      return itemFrame(
        id,
        <button
          className={`status-command group-select-command ${groupsOpen ? "is-active" : ""}`}
          type="button"
          onClick={onToggleGroups}
          aria-expanded={groupsOpen}
          aria-haspopup="dialog"
          aria-controls="groups-menu"
          aria-label={t.toggleSidebar}
          title={t.sidebarTitle}
        >
          <span className="status-icon">
            <Layers size={16} strokeWidth={1.8} />
            {hasGroupUpdateToday && (
              <span
                className="status-dot"
                role="img"
                aria-label={t.updatedToday}
              />
            )}
          </span>
          <span className="status-label group-command-label">{t.menu}</span>
          <span className="group-current-value" aria-hidden="true">
            {activeGroupName}
          </span>
        </button>,
      );
    if (id === "core:dashboard")
      return itemFrame(
        id,
        <button
          className={`status-command dashboard-command ${dashboardOpen ? "is-active" : ""}`}
          type="button"
          onClick={onToggleDashboard}
          aria-expanded={dashboardOpen}
          aria-controls="dashboard-panel"
        >
          <span className="status-icon">
            <LayoutDashboard size={16} strokeWidth={1.8} />
          </span>
          <span className="status-label">{t.dashboard}</span>
        </button>,
      );
    if (id === "core:account")
      return itemFrame(
        id,
        <div className="footer-auth">
          <Auth />
        </div>,
      );
    const details = itemDetails(id);
    if (!details) return null;
    const { Icon, label } = details;
    return itemFrame(
      id,
      <button
        type="button"
        className="status-command footer-pinned-command"
        title={label}
        aria-label={label}
        onClick={() => void activateItem(id)}
      >
        <span className="status-icon">
          <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <span className="status-label footer-pinned-label">{label}</span>
      </button>,
    );
  };

  return (
    <footer
      className={`footer ${iconsOnly ? "is-icons-only" : ""}`}
      onClickCapture={(event) => {
        const guard = swipeClickGuard.current;
        if (!guard) return;
        if (performance.now() > guard.expiresAt) {
          swipeClickGuard.current = null;
          return;
        }
        if (!(event.target instanceof Node)) return;
        const sameSwipeTarget = guard.target.matches("button, a")
          ? guard.target.contains(event.target)
          : event.target === guard.target;
        if (!sameSwipeTarget) return;
        event.preventDefault();
        event.stopPropagation();
        swipeClickGuard.current = null;
      }}
      onPointerDown={(event) => {
        if (!onSwipeTabs || !window.matchMedia("(max-width: 512px)").matches)
          return;
        if (!(event.target instanceof Element)) return;
        swipeClickGuard.current = null;
        swipeStart.current = {
          x: event.clientX,
          y: event.clientY,
          pointerId: event.pointerId,
          target: event.target,
        };
        event.target.setPointerCapture(event.pointerId);
      }}
      onPointerUp={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (start?.target.hasPointerCapture(event.pointerId))
          start.target.releasePointerCapture(event.pointerId);
        if (!start || start.pointerId !== event.pointerId || !onSwipeTabs)
          return;
        const horizontal = event.clientX - start.x;
        const vertical = event.clientY - start.y;
        if (
          Math.abs(horizontal) < 50 ||
          Math.abs(horizontal) <= Math.abs(vertical)
        )
          return;
        const clickGuard = {
          target: start.target.closest("button, a") ?? start.target,
          expiresAt: performance.now() + 100,
        };
        swipeClickGuard.current = clickGuard;
        requestAnimationFrame(() => {
          if (swipeClickGuard.current === clickGuard)
            swipeClickGuard.current = null;
        });
        onSwipeTabs(horizontal < 0 ? "left" : "right");
      }}
      onPointerCancel={(event) => {
        const start = swipeStart.current;
        swipeStart.current = null;
        if (start?.target.hasPointerCapture(event.pointerId))
          start.target.releasePointerCapture(event.pointerId);
      }}
    >
      <span className="footer-current-group" title={activeGroupName}>
        {activeGroupName}
      </span>
      <div className="status-meta">
        <div className="footer-dock">{footerItems.map(renderItem)}</div>
      </div>
      {pinMenu &&
        createPortal(
          <div
            className="footer-pin-menu"
            role="menu"
            style={{
              left: Math.max(8, Math.min(pinMenu.x, window.innerWidth - 188)),
              top: Math.max(8, Math.min(pinMenu.y, window.innerHeight - 52)),
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setFooterItems(
                  footerItems.includes(pinMenu.id)
                    ? footerItems.filter((id) => id !== pinMenu.id)
                    : [...footerItems, pinMenu.id],
                );
                setPinMenu(null);
              }}
            >
              {footerItems.includes(pinMenu.id)
                ? t.unpinFromFooter
                : t.pinToFooter}
            </button>
          </div>,
          document.body,
        )}
    </footer>
  );
}
