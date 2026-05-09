import { useState } from "react";
import GridItems from "./GridItems";

interface Props {
  gridSize: number;
  onGridSizeChange: (gridSize: number) => void;
}

function GridBg({ gridSize, onGridSizeChange }: Props) {
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
        <GridItems gridSize={gridSize} panX={pan.x} panY={pan.y}></GridItems>
      </div>
    </div>
  );
}

export default GridBg;
