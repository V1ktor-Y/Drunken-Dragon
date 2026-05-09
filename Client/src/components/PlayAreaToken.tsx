import { useState } from "react";
import Droppable from "./Droppable";

interface Props {
  image_source: string;
  gridX: number;
  gridY: number;
  panX: number;
  panY: number;
  gridSize: number;
}

function PlayAreaToken({ image_source, gridSize, gridX, gridY }: Props) {
  const [isDragging, setIsDragging] = useState(false);

  // Store logical coordinates instead of absolute pixels
  const [logicalPos, setLogicalPos] = useState({ x: gridX, y: gridY });
  const [destinationCell, setDestinationCell] = useState({
    x: gridX,
    y: gridY,
  });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (event: React.PointerEvent<HTMLImageElement>) => {
    event.stopPropagation();
    setIsDragging(true);
    setLastPos({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    const deltaX = event.clientX - lastPos.x;
    const deltaY = event.clientY - lastPos.y;

    setLogicalPos((prev) => {
      const newX = prev.x + deltaX / gridSize;
      const newY = prev.y + deltaY / gridSize;

      setDestinationCell({
        x: Math.round(newX),
        y: Math.round(newY),
      });

      return { x: newX, y: newY };
    });

    setLastPos({ x: event.clientX, y: event.clientY });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLImageElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    // Snap to destination cell on drop
    setLogicalPos(destinationCell);
  };

  return (
    <>
      <img
        src={image_source}
        height={gridSize}
        width={gridSize}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="grid-component"
        style={{
          position: "absolute",
          left: logicalPos.x * gridSize,
          top: logicalPos.y * gridSize,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: isDragging ? 100 : 1,
        }}
      />
      {isDragging && (
        <Droppable
          gridSize={gridSize}
          gridX={destinationCell.x}
          gridY={destinationCell.y}
        />
      )}
    </>
  );
}

export default PlayAreaToken;
