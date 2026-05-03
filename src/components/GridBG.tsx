import { useState, type ReactNode } from "react";
import testImage from "../assets/hero.png";
import Droppable from "./Droppable";
import Draggable from "./Draggable";
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
  const gridItems = [
    {
      id: 1,
      gridX: 0,
      gridY: 0,
      text: "Origin (0,0)",
      image_source: testImage,
    },
    { id: 2, gridX: 2, gridY: 1, text: "Cell (2,1)", image_source: testImage },
    {
      id: 3,
      gridX: -2,
      gridY: -1,
      text: "Cell (-2,-1)",
      image_source: testImage,
    },
  ];
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
        {/* 3. Render the components onto the canvas */}
        {gridItems.map(({ id, gridX, gridY, text }) => (
          <div
            key={id}
            className="grid-component"
            style={{
              // Convert grid coordinates to actual pixels
              left: gridX * GRID_SIZE,
              top: gridY * GRID_SIZE,
              width: GRID_SIZE,
              height: GRID_SIZE,
            }}
          >
            {text}
            <Draggable
              key={id} // Don't forget the key prop when mapping!
              id={id}
              gridX={gridX}
              gridY={gridY}
              text={text}
              image_source={testImage}
            />
          </div>
        ))}
      </div>
    </div>
  );
  /*
  return (
    <div
      className="grid-pattern"
      style={{ "--size": "100px" } as React.CSSProperties}
    >
      {children}
    </div>
  );
  */
}

export default GridBg;
