import { useEffect, useRef, useState } from "react";
import GridBg from "./GridBG";
import { TurnTracker } from "./TurnTracker";
import { ZoomSlider } from "./ZoomSlider";
import type { GameFieldMap } from "../../types/maps";
import type { PlacedToken, SidebarToken } from "../../types/tokens";

const MIN_GRID_SIZE = 20;
const MAX_GRID_SIZE = 300;
const GRID_STEP = 10;

interface StageProps {
  gameFieldMaps: GameFieldMap[];
  placedTokens: PlacedToken[];
  encounterTokens: PlacedToken[];
  activeTokenInstanceId: string | null;
  onActiveTokenChange: (tokenInstanceId: string | null) => void;
  onPlaceToken: (token: SidebarToken, gridX: number, gridY: number) => void;
  onSelectToken: (tokenId: string) => void;
  onDeletePlacedToken: (tokenInstanceId: string) => void;
}

const TRASH_ZONE_REVEAL_GUTTER = 220;

export function Stage({
  gameFieldMaps,
  placedTokens,
  encounterTokens,
  activeTokenInstanceId,
  onActiveTokenChange,
  onPlaceToken,
  onSelectToken,
  onDeletePlacedToken,
}: StageProps) {
  const stageRef = useRef<HTMLElement>(null);
  const trashZoneRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState(100);
  const [isTokenDragging, setIsTokenDragging] = useState(false);
  const [dragClientX, setDragClientX] = useState<number | null>(null);

  const updateGridSize = (nextGridSize: number) => {
    setGridSize(Math.max(MIN_GRID_SIZE, Math.min(nextGridSize, MAX_GRID_SIZE)));
  };

  const isPointInTrashZone = (clientX: number, clientY: number) => {
    const rect = trashZoneRef.current?.getBoundingClientRect();
    if (!rect) return false;

    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  const isNearRightEdge = (() => {
    if (!isTokenDragging || dragClientX === null) return false;
    const stageRect = stageRef.current?.getBoundingClientRect();
    if (!stageRect) return false;
    return dragClientX >= stageRect.right - TRASH_ZONE_REVEAL_GUTTER;
  })();

  useEffect(() => {
    if (
      !activeTokenInstanceId ||
      encounterTokens.some((token) => token.instanceId === activeTokenInstanceId)
    ) {
      return;
    }

    const activeTokenTimeout = window.setTimeout(() => {
      onActiveTokenChange(null);
    }, 0);

    return () => window.clearTimeout(activeTokenTimeout);
  }, [activeTokenInstanceId, encounterTokens, onActiveTokenChange]);

  return (
    <main ref={stageRef} className="stage">
      <GridBg
        gridSize={gridSize}
        gameFieldMaps={gameFieldMaps}
        placedTokens={placedTokens}
        activeTokenInstanceId={activeTokenInstanceId}
        onGridSizeChange={updateGridSize}
        onPlaceToken={onPlaceToken}
        onSelectToken={onSelectToken}
        onDeletePlacedToken={onDeletePlacedToken}
        onTokenDragStateChange={(isDragging, clientX) => {
          setIsTokenDragging(isDragging);
          setDragClientX(isDragging ? clientX ?? null : null);
        }}
        isPointInTrashZone={isPointInTrashZone}
      />
      <div
        ref={trashZoneRef}
        className={`token-trash-zone ${isNearRightEdge ? "token-trash-zone-visible" : ""}`}
        aria-hidden={!isNearRightEdge}
      >
        <span className="token-trash-icon">DEL</span>
        <span>Drop to delete</span>
      </div>
      <TurnTracker
        activeTokenInstanceId={activeTokenInstanceId}
        placedTokens={encounterTokens}
        onActiveTokenChange={onActiveTokenChange}
      />
      <ZoomSlider
        gridSize={gridSize}
        min={MIN_GRID_SIZE}
        max={MAX_GRID_SIZE}
        onZoomIn={() => updateGridSize(gridSize + GRID_STEP)}
        onZoomOut={() => updateGridSize(gridSize - GRID_STEP)}
        onZoomChange={updateGridSize}
      />
    </main>
  );
}
