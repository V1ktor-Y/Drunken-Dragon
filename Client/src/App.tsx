import { useState } from "react";
import { Stage } from "./components/Stage/Stage";
import { Sidebar } from "./components/Sidebar/Sidebar";
import type { GameFieldMap, StoredMap } from "./types/maps";

function createGameFieldMap(map: StoredMap, src: string): GameFieldMap {
  return {
    ...map,
    src,
    widthCells: 10,
    heightCells: 10,
    gridX: 0,
    gridY: 0,
  };
}

function App() {
  const [gameFieldMaps, setGameFieldMaps] = useState<GameFieldMap[]>([]);

  return (
    <div className="app-shell">
      <Stage gameFieldMaps={gameFieldMaps} />
      <Sidebar
        gameFieldMaps={gameFieldMaps}
        onAddMapToField={(map, src) =>
          setGameFieldMaps((currentMaps) =>
            currentMaps.some((currentMap) => currentMap.id === map.id)
              ? currentMaps
              : [...currentMaps, createGameFieldMap(map, src)],
          )
        }
        onRemoveMapFromField={(mapId) =>
          setGameFieldMaps((currentMaps) =>
            currentMaps.filter((currentMap) => currentMap.id !== mapId),
          )
        }
        onUpdateGameFieldMap={(mapId, updates) =>
          setGameFieldMaps((currentMaps) =>
            currentMaps.map((currentMap) =>
              currentMap.id === mapId ? { ...currentMap, ...updates } : currentMap,
            ),
          )
        }
      />
    </div>
  );
}

export default App;
