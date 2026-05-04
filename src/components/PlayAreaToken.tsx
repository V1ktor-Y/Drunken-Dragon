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

function PlayAreaToken({
  image_source,
  gridSize,
  gridX,
  gridY,
  panX,
  panY,
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [destinationCell, setDestinationCell] = useState({
    x: gridX,
    y: gridY,
  });
  const [position, setPosition] = useState({
    x: gridX * gridSize,
    y: gridY * gridSize,
  });
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // does not send event up to parent
    event.stopPropagation();
    setIsDragging(true);
    setLastPos({ x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = event.clientX - lastPos.x;
    const deltaY = event.clientY - lastPos.y;

    setPosition((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }));
    setLastPos({ x: event.clientX, y: event.clientY });
    setDestinationCell(() => ({
      x: Math.round(position.x / gridSize),
      y: Math.round(position.y / gridSize),
    }));
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    setPosition({
      x: destinationCell.x * gridSize,
      y: destinationCell.y * gridSize,
    });
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
        draggable={false}
        className="grid-component"
        style={{
          position: "absolute",
          left: position.x,
          top: position.y,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: 10,
        }}
      />
      {isDragging && (
        <Droppable
          gridSize={gridSize}
          gridX={destinationCell.x}
          gridY={destinationCell.y}
        ></Droppable>
      )}
    </>
  );
}

export default PlayAreaToken;
