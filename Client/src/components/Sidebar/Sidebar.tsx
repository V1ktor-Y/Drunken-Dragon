import { useState } from "react";
import { SidebarTabs } from "./SidebarTabs";
import { TokenList } from "./TokenList";

const DEFAULT_SIDEBAR_WIDTH = 320;
const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 560;
const MIN_STAGE_WIDTH = 320;

function getMaxSidebarWidth() {
  return Math.min(MAX_SIDEBAR_WIDTH, window.innerWidth - MIN_STAGE_WIDTH);
}

function clampSidebarWidth(width: number) {
  return Math.max(MIN_SIDEBAR_WIDTH, Math.min(width, getMaxSidebarWidth()));
}

export function Sidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [dragStart, setDragStart] = useState<{
    pointerX: number;
    sidebarWidth: number;
  } | null>(null);

  const handleResizePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragStart({ pointerX: e.clientX, sidebarWidth });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleResizePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    const nextWidth = dragStart.sidebarWidth + dragStart.pointerX - e.clientX;
    setSidebarWidth(clampSidebarWidth(nextWidth));
  };

  const handleResizePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setDragStart(null);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <aside
      className={`sidebar ${dragStart ? "sidebar-resizing" : ""}`}
      style={{ "--sidebar-width": `${sidebarWidth}px` } as React.CSSProperties}
    >
      <div
        className="sidebar-resize-handle"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        onPointerDown={handleResizePointerDown}
        onPointerMove={handleResizePointerMove}
        onPointerUp={handleResizePointerUp}
        onPointerCancel={handleResizePointerUp}
      />
      <SidebarTabs />
      <TokenList />
      <div className="sidebar-footer">
        <button className="command-button sidebar-action" type="button">
          + New Encounter
        </button>
      </div>
    </aside>
  );
}
