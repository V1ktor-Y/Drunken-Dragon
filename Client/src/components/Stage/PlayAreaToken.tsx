import { useRef, useState } from "react";
import Droppable from "./Droppable";

interface Props {
  tokenId?: string;
  imageSource?: string;
  name: string;
  gridX: number;
  gridY: number;
  panX: number;
  panY: number;
  gridSize: number;
  onSelect?: (tokenId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function PlayAreaToken({ tokenId, imageSource, name, gridSize, gridX, gridY, onSelect }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    lastX: number;
    lastY: number;
    hasMoved: boolean;
    destinationCell: { x: number; y: number };
  } | null>(null);

  // Store logical coordinates instead of absolute pixels
  const [logicalPos, setLogicalPos] = useState({ x: gridX, y: gridY });
  const [destinationCell, setDestinationCell] = useState({
    x: gridX,
    y: gridY,
  });

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      hasMoved: false,
      destinationCell,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const totalDistance = Math.hypot(
      event.clientX - dragState.startX,
      event.clientY - dragState.startY,
    );

    if (!dragState.hasMoved && totalDistance < 4) return;

    dragState.hasMoved = true;
    setIsDragging(true);

    const deltaX = event.clientX - dragState.lastX;
    const deltaY = event.clientY - dragState.lastY;

    setLogicalPos((prev) => {
      const newX = prev.x + deltaX / gridSize;
      const newY = prev.y + deltaY / gridSize;
      const nextDestinationCell = {
        x: Math.round(newX),
        y: Math.round(newY),
      };

      dragState.destinationCell = nextDestinationCell;
      setDestinationCell(nextDestinationCell);

      return { x: newX, y: newY };
    });

    dragState.lastX = event.clientX;
    dragState.lastY = event.clientY;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragState.hasMoved && tokenId) {
      onSelect?.(tokenId);
      return;
    }

    setLogicalPos(dragState.destinationCell);
  };

  return (
    <>
      <div
        aria-label={name}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        className="grid-component"
        style={{
          position: "absolute",
          width: gridSize,
          height: gridSize,
          left: logicalPos.x * gridSize,
          top: logicalPos.y * gridSize,
          cursor: isDragging ? "grabbing" : "grab",
          zIndex: isDragging ? 100 : 1,
          backgroundImage: imageSource ? `url(${imageSource})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {!imageSource && <span>{getInitials(name) || "T"}</span>}
      </div>
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
