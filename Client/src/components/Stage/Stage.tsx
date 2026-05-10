import { useEffect, useRef, useState } from "react";
import GridBg from "../GridBG";
import { TurnTracker } from "./TurnTracker";
import { ZoomSlider } from "./ZoomSlider";

const MIN_GRID_SIZE = 20;
const MAX_GRID_SIZE = 300;
const GRID_STEP = 10;
const DEFAULT_MAP_WIDTH_CELLS = 30;

export type MapBackground = {
  src: string;
  name: string;
  widthCells: number;
  heightCells: number;
  opacity: number;
};

export function Stage() {
  const [gridSize, setGridSize] = useState(100);
  const [mapBackground, setMapBackground] = useState<MapBackground | null>(null);
  const mapBackgroundUrlRef = useRef<string | null>(null);

  const updateGridSize = (nextGridSize: number) => {
    setGridSize(Math.max(MIN_GRID_SIZE, Math.min(nextGridSize, MAX_GRID_SIZE)));
  };

  useEffect(() => {
    return () => {
      if (mapBackgroundUrlRef.current) {
        URL.revokeObjectURL(mapBackgroundUrlRef.current);
      }
    };
  }, []);

  const updateMapBackground = (updates: Partial<MapBackground>) => {
    setMapBackground((currentMapBackground) => {
      if (!currentMapBackground) return currentMapBackground;

      return {
        ...currentMapBackground,
        ...updates,
      };
    });
  };

  const handleMapUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];

    if (!file) return;

    const src = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const aspectRatio = image.naturalHeight / image.naturalWidth || 1;
      const heightCells = Math.max(1, Math.round(DEFAULT_MAP_WIDTH_CELLS * aspectRatio));

      if (mapBackgroundUrlRef.current) {
        URL.revokeObjectURL(mapBackgroundUrlRef.current);
      }

      mapBackgroundUrlRef.current = src;

      setMapBackground({
        src,
        name: file.name,
        widthCells: DEFAULT_MAP_WIDTH_CELLS,
        heightCells,
        opacity: 1,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(src);
    };

    image.src = src;
    event.currentTarget.value = "";
  };

  const handleRemoveMap = () => {
    if (mapBackgroundUrlRef.current) {
      URL.revokeObjectURL(mapBackgroundUrlRef.current);
      mapBackgroundUrlRef.current = null;
    }

    setMapBackground(null);
  };

  return (
    <main className="stage">
      <GridBg
        gridSize={gridSize}
        mapBackground={mapBackground}
        onGridSizeChange={updateGridSize}
      />
      <TurnTracker />
      <section className="map-controls" aria-label="Map background controls">
        <label className="map-upload-button">
          Upload Map
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleMapUpload}
          />
        </label>
        {mapBackground && (
          <>
            <p className="map-file-name" title={mapBackground.name}>
              {mapBackground.name}
            </p>
            <label className="map-control-field">
              W
              <input
                type="number"
                min="1"
                value={mapBackground.widthCells}
                onChange={(event) =>
                  updateMapBackground({
                    widthCells: Math.max(1, Number(event.currentTarget.value)),
                  })
                }
                aria-label="Map width in grid cells"
              />
            </label>
            <label className="map-control-field">
              H
              <input
                type="number"
                min="1"
                value={mapBackground.heightCells}
                onChange={(event) =>
                  updateMapBackground({
                    heightCells: Math.max(1, Number(event.currentTarget.value)),
                  })
                }
                aria-label="Map height in grid cells"
              />
            </label>
            <label className="map-opacity-field">
              Opacity
              <input
                type="range"
                min="0.2"
                max="1"
                step="0.05"
                value={mapBackground.opacity}
                onChange={(event) =>
                  updateMapBackground({ opacity: Number(event.currentTarget.value) })
                }
              />
            </label>
            <button className="map-remove-button" type="button" onClick={handleRemoveMap}>
              Remove
            </button>
          </>
        )}
      </section>
      <ZoomSlider
        gridSize={gridSize}
        min={MIN_GRID_SIZE}
        max={MAX_GRID_SIZE}
        onZoomIn={() => updateGridSize(gridSize + GRID_STEP)}
        onZoomOut={() => updateGridSize(gridSize - GRID_STEP)}
        onZoomChange={updateGridSize}
      />
      {!mapBackground && (
        <div className="stage-status" aria-hidden="true">
          <p>Awaiting Tactical Data...</p>
        </div>
      )}
    </main>
  );
}
