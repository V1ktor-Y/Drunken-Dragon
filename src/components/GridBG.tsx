import { useState, type ReactNode } from "react";
import GridItems from "./GridItems";
interface Props {
  children?: ReactNode;
}
function GridBg({ children }: Props) {
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
    e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const GRID_SIZE = 100;
  return (
    <div
      className="viewport"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={
        {
          "--size": `${GRID_SIZE}px`,
          "--pan-x": `${pan.x}px`,
          "--pan-y": `${pan.y}px`,
          cursor: isDragging ? "grabbing" : "grab",
        } as React.CSSProperties
      }
    >
      {/* 2. The Invisible Canvas Layer */}
      <div
        className="canvas-layer"
        style={{
          // Move the entire canvas by the pan amount
          transform: `translate(${pan.x}px, ${pan.y}px)`,
        }}
      >
        <GridItems gridSize={GRID_SIZE} panX={pan.x} panY={pan.y}></GridItems>
      </div>
    </div>
  );
}

export default GridBg;
