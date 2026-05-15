import { useState } from "react";
import { Stage } from "./components/Stage/Stage";
import { Sidebar } from "./components/Sidebar/Sidebar";
import type { GameFieldMap, StoredMap } from "./types/maps";
import type { PlacedToken, SidebarToken } from "./types/tokens";

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
  const [placedTokens, setPlacedTokens] = useState<PlacedToken[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedTokenVersion, setSelectedTokenVersion] = useState(0);

  const handlePlaceToken = (token: SidebarToken, gridX: number, gridY: number) => {
    setPlacedTokens((currentTokens) => [
      ...currentTokens,
      {
        ...token,
        instanceId: `${token.id}-${Date.now()}-${crypto.randomUUID()}`,
        gridX,
        gridY,
      },
    ]);
  };

  const handleTokenUpdate = (updatedToken: SidebarToken) => {
    setPlacedTokens((currentTokens) =>
      currentTokens.map((token) =>
        token.id === updatedToken.id ? { ...token, ...updatedToken } : token,
      ),
    );
  };

  const handleSelectToken = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setSelectedTokenVersion((currentVersion) => currentVersion + 1);
  };

  return (
    <div className="app-shell">
      <Stage
        gameFieldMaps={gameFieldMaps}
        placedTokens={placedTokens}
        onPlaceToken={handlePlaceToken}
        onSelectToken={handleSelectToken}
      />
      <Sidebar
        gameFieldMaps={gameFieldMaps}
        selectedTokenId={selectedTokenId}
        selectedTokenVersion={selectedTokenVersion}
        onTokenUpdate={handleTokenUpdate}
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
