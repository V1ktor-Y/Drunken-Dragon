import { useState } from "react";
import GridItems from "./GridItems";
import type { GameFieldMap } from "../../types/maps";

interface Props {
  gridSize: number;
  gameFieldMaps: GameFieldMap[];
  onGridSizeChange: (gridSize: number) => void;
}

function GridBg({ gridSize, gameFieldMaps, onGridSizeChange }: Props) {
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
  return (
    <div
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
        <GridItems gridSize={gridSize} panX={pan.x} panY={pan.y}></GridItems>
      </div>
    </div>
  );
}

export default GridBg;
