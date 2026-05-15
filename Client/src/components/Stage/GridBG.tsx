import { useEffect, useRef, useState } from "react";
import GridItems from "./GridItems";
import type { GameFieldMap } from "../../types/maps";
import type { PlacedToken, SidebarToken, TokenDropRequestDetail } from "../../types/tokens";

interface Props {
  gridSize: number;
  gameFieldMaps: GameFieldMap[];
  placedTokens: PlacedToken[];
  activeTokenInstanceId: string | null;
  onGridSizeChange: (gridSize: number) => void;
  onPlaceToken: (token: SidebarToken, gridX: number, gridY: number) => void;
  onSelectToken: (tokenId: string) => void;
  onDeletePlacedToken: (tokenInstanceId: string) => void;
  onTokenDragStateChange: (isDragging: boolean, clientX?: number) => void;
  isPointInTrashZone: (clientX: number, clientY: number) => boolean;
}

function GridBg({
  gridSize,
  gameFieldMaps,
  placedTokens,
  activeTokenInstanceId,
  onGridSizeChange,
  onPlaceToken,
  onSelectToken,
  onDeletePlacedToken,
  onTokenDragStateChange,
  isPointInTrashZone,
}: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.x;
    const deltaY = e.clientY - lastPos.y;

    setPan((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const zoomSpeed = 0.5;
    const newSize = gridSize + (e.deltaY < 0 ? zoomSpeed : -zoomSpeed) * 10;

    onGridSizeChange(Math.max(20, Math.min(newSize, 300)));
  };

  useEffect(() => {
    const handleTokenDropRequest = (event: Event) => {
      const { token, clientX, clientY } = (event as CustomEvent<TokenDropRequestDetail>).detail;
      const viewport = viewportRef.current;
      if (!viewport) return;

      const rect = viewport.getBoundingClientRect();
      const isInsideViewport =
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;

      if (!isInsideViewport) return;

      const gridX = Math.floor((clientX - rect.left - pan.x) / gridSize);
      const gridY = Math.floor((clientY - rect.top - pan.y) / gridSize);
      onPlaceToken(token, gridX, gridY);
      event.preventDefault();
    };

    window.addEventListener("drunken-dragon-token-drop", handleTokenDropRequest);
    return () => window.removeEventListener("drunken-dragon-token-drop", handleTokenDropRequest);
  }, [gridSize, onPlaceToken, pan.x, pan.y]);

  return (
    <div
      ref={viewportRef}
      className="viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      style={
        {
          "--size": `${gridSize}px`,
          "--pan-x": `${pan.x}px`,
          "--pan-y": `${pan.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
        } as React.CSSProperties
      }
    >
      <div
        className="canvas-layer"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        {gameFieldMaps.map((gameFieldMap) => (
          <div className="map-field-layer" key={gameFieldMap.id}>
            <img
              className="map-background"
              src={gameFieldMap.src}
              alt={gameFieldMap.name}
              draggable={false}
              style={{
                width: `${gameFieldMap.widthCells * gridSize}px`,
                height: `${gameFieldMap.heightCells * gridSize}px`,
                transform: `translate(${gameFieldMap.gridX * gridSize}px, ${
                  gameFieldMap.gridY * gridSize
                }px)`,
              }}
            />
            <div
              className="map-grid-overlay"
              aria-hidden="true"
              style={{
                width: `${gameFieldMap.widthCells * gridSize}px`,
                height: `${gameFieldMap.heightCells * gridSize}px`,
                backgroundSize: `${gridSize}px ${gridSize}px`,
                transform: `translate(${gameFieldMap.gridX * gridSize}px, ${
                  gameFieldMap.gridY * gridSize
                }px)`,
              }}
            />
          </div>
        ))}
        <GridItems
          gridSize={gridSize}
          panX={pan.x}
          panY={pan.y}
          placedTokens={placedTokens}
          activeTokenInstanceId={activeTokenInstanceId}
          onSelectToken={onSelectToken}
          onDeletePlacedToken={onDeletePlacedToken}
          onTokenDragStateChange={onTokenDragStateChange}
          isPointInTrashZone={isPointInTrashZone}
        ></GridItems>
      </div>
    </div>
  );
}

export default GridBg;
