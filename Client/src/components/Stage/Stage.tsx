import { useState } from "react";
import GridBg from "./GridBG";
import { TurnTracker } from "./TurnTracker";
import { ZoomSlider } from "./ZoomSlider";

const MIN_GRID_SIZE = 20;
const MAX_GRID_SIZE = 300;
const GRID_STEP = 10;

export function Stage() {
  const [gridSize, setGridSize] = useState(100);

  const updateGridSize = (nextGridSize: number) => {
    setGridSize(Math.max(MIN_GRID_SIZE, Math.min(nextGridSize, MAX_GRID_SIZE)));
  };

  return (
    <main className="stage">
      <GridBg gridSize={gridSize} onGridSizeChange={updateGridSize} />
      <TurnTracker />
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
