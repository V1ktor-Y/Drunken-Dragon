import { useRef, useState } from "react";
import Droppable from "./Droppable";

interface Props {
  tokenInstanceId?: string;
  tokenId?: string;
  isActive?: boolean;
  imageSource?: string;
  name: string;
  gridX: number;
  gridY: number;
  panX: number;
  panY: number;
  gridSize: number;
  onSelect?: (tokenId: string) => void;
  onDelete?: (tokenInstanceId: string) => void;
  onDragStateChange?: (isDragging: boolean, clientX?: number) => void;
  isPointInTrashZone?: (clientX: number, clientY: number) => boolean;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function PlayAreaToken({
  tokenInstanceId,
  tokenId,
  isActive = false,
  imageSource,
  name,
  gridSize,
  gridX,
  gridY,
  onSelect,
  onDelete,
  onDragStateChange,
  isPointInTrashZone,
}: Props) {
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
    onDragStateChange?.(true, event.clientX);

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
    onDragStateChange?.(true, event.clientX);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const dragState = dragRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragRef.current = null;
    setIsDragging(false);
    onDragStateChange?.(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (!dragState.hasMoved && tokenId) {
      onSelect?.(tokenId);
      return;
    }

    if (
      tokenInstanceId &&
      isPointInTrashZone?.(event.clientX, event.clientY)
    ) {
      onDelete?.(tokenInstanceId);
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
        className={`grid-component ${isActive ? "grid-component-active" : ""}`}
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
