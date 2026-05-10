import { useState } from "react";
import { AccountPanel } from "./AccountPanel";
import { DicePanel } from "./DicePanel";
import { NotesPanel } from "./NotesPanel";
import { MapPanel } from "./MapPanel";
import { SidebarTabs, type SidebarTab } from "./SidebarTabs";
import { TokenList } from "./TokenList";
import type { GameFieldMap, StoredMap } from "../../types/maps";

const DEFAULT_SIDEBAR_WIDTH = 460;
const MIN_SIDEBAR_WIDTH = 380;
const MAX_SIDEBAR_WIDTH = 560;
const MIN_STAGE_WIDTH = 320;

function getMaxSidebarWidth() {
  return Math.min(MAX_SIDEBAR_WIDTH, window.innerWidth - MIN_STAGE_WIDTH);
}

function clampSidebarWidth(width: number) {
  return Math.max(MIN_SIDEBAR_WIDTH, Math.min(width, getMaxSidebarWidth()));
}

interface SidebarProps {
  gameFieldMaps: GameFieldMap[];
  onAddMapToField: (map: StoredMap, src: string) => void;
  onRemoveMapFromField: (mapId: number) => void;
  onUpdateGameFieldMap: (mapId: number, updates: Partial<GameFieldMap>) => void;
}

export function Sidebar({
  gameFieldMaps,
  onAddMapToField,
  onRemoveMapFromField,
  onUpdateGameFieldMap,
}: SidebarProps) {
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [activeTab, setActiveTab] = useState<SidebarTab>("Tokens");
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
      <SidebarTabs activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="sidebar-panel" role="tabpanel" aria-label={activeTab}>
        {activeTab === "Tokens" && <TokenList />}
        {activeTab === "Dice" && <DicePanel />}
        {activeTab === "Notes" && <NotesPanel />}
        {activeTab === "Map" && (
          <MapPanel
            gameFieldMaps={gameFieldMaps}
            onAddMapToField={onAddMapToField}
            onRemoveMapFromField={onRemoveMapFromField}
            onUpdateGameFieldMap={onUpdateGameFieldMap}
          />
        )}
        {activeTab === "Account" && <AccountPanel />}
      </div>
      {activeTab === "Tokens" && (
        <div className="sidebar-footer">
          <button className="command-button sidebar-action" type="button">
            + New Encounter
          </button>
        </div>
      )}
    </aside>
  );
}
