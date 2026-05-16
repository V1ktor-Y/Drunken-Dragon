import { useRef, useState } from "react";
import { Stage } from "./components/Stage/Stage";
import { Sidebar } from "./components/Sidebar/Sidebar";
import type { GameFieldMap, StoredMap } from "./types/maps";
import type { PlacedToken, SidebarToken, TokenCloneCreatedDetail } from "./types/tokens";

const TOKEN_STORAGE_KEY = "drunkenDragon.tokens";

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

function createTokenClone(token: SidebarToken, copyNumber: number): SidebarToken {
  const baseName = token.baseName ?? token.name;
  const sourceTokenId = token.sourceTokenId ?? token.id;

  return {
    ...token,
    id: `token-copy-${Date.now()}-${crypto.randomUUID()}`,
    name: `${baseName} ${copyNumber}`,
    sourceTokenId,
    baseName,
  };
}

function App() {
  const [gameFieldMaps, setGameFieldMaps] = useState<GameFieldMap[]>([]);
  const [placedTokens, setPlacedTokens] = useState<PlacedToken[]>([]);
  const [encounterTokens, setEncounterTokens] = useState<PlacedToken[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [selectedTokenVersion, setSelectedTokenVersion] = useState(0);
  const [activeTokenInstanceId, setActiveTokenInstanceId] = useState<string | null>(null);
  const lastDropRef = useRef<{
    tokenId: string;
    gridX: number;
    gridY: number;
    timestamp: number;
  } | null>(null);

  const getStoredTokenFamilyCount = (token: SidebarToken) => {
    const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!storedTokens) return 0;

    try {
      const tokens = JSON.parse(storedTokens) as SidebarToken[];
      const sourceTokenId = token.sourceTokenId ?? token.id;

      return tokens.filter(
        (storedToken) =>
          storedToken.id === sourceTokenId ||
          storedToken.sourceTokenId === sourceTokenId,
      ).length;
    } catch {
      return 0;
    }
  };

  const handlePlaceToken = (token: SidebarToken, gridX: number, gridY: number) => {
    const now = Date.now();
    const lastDrop = lastDropRef.current;
    if (
      lastDrop &&
      lastDrop.tokenId === token.id &&
      lastDrop.gridX === gridX &&
      lastDrop.gridY === gridY &&
      now - lastDrop.timestamp < 120
    ) {
      return;
    }
    lastDropRef.current = {
      tokenId: token.id,
      gridX,
      gridY,
      timestamp: now,
    };

    const shouldCloneToken = placedTokens.some((currentToken) => currentToken.id === token.id);
    const storedFamilyCount = getStoredTokenFamilyCount(token);
    const sourceTokenId = token.sourceTokenId ?? token.id;
    const placedCopyCount = placedTokens.filter(
      (currentToken) =>
        currentToken.id === sourceTokenId ||
        currentToken.sourceTokenId === sourceTokenId,
    ).length;
    const copyNumber = Math.max(storedFamilyCount, placedCopyCount || 1);

    const tokenForPlacement = shouldCloneToken
      ? createTokenClone(token, copyNumber)
      : token;

    if (shouldCloneToken) {
      window.dispatchEvent(
        new CustomEvent<TokenCloneCreatedDetail>("drunken-dragon-token-cloned", {
          detail: { token: tokenForPlacement },
        }),
      );
    }

    setPlacedTokens((currentTokens) => [
      ...currentTokens,
      {
        ...tokenForPlacement,
        instanceId: `${tokenForPlacement.id}-${Date.now()}-${crypto.randomUUID()}`,
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
    setEncounterTokens((currentTokens) =>
      currentTokens.map((token) =>
        token.id === updatedToken.id ? { ...token, ...updatedToken, init: token.init } : token,
      ),
    );
  };

  const handleSelectToken = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setSelectedTokenVersion((currentVersion) => currentVersion + 1);
  };

  const handleTokenDelete = (tokenId: string) => {
    setPlacedTokens((currentTokens) =>
      currentTokens.filter((token) => token.id !== tokenId),
    );
    setEncounterTokens((currentTokens) =>
      currentTokens.filter((token) => token.id !== tokenId),
    );
    if (selectedTokenId === tokenId) {
      setSelectedTokenId(null);
    }
  };

  const handleDeletePlacedToken = (tokenInstanceId: string) => {
    setPlacedTokens((currentTokens) =>
      currentTokens.filter((token) => token.instanceId !== tokenInstanceId),
    );
    setEncounterTokens((currentTokens) =>
      currentTokens.filter((token) => token.instanceId !== tokenInstanceId),
    );
  };

  return (
    <div className="app-shell">
      <Stage
        gameFieldMaps={gameFieldMaps}
        placedTokens={placedTokens}
        encounterTokens={encounterTokens}
        activeTokenInstanceId={activeTokenInstanceId}
        onActiveTokenChange={setActiveTokenInstanceId}
        onPlaceToken={handlePlaceToken}
        onSelectToken={handleSelectToken}
        onDeletePlacedToken={handleDeletePlacedToken}
      />
      <Sidebar
        gameFieldMaps={gameFieldMaps}
        selectedTokenId={selectedTokenId}
        selectedTokenVersion={selectedTokenVersion}
        placedTokens={placedTokens}
        encounterTokens={encounterTokens}
        activeTokenInstanceId={activeTokenInstanceId}
        onEncounterTokensChange={setEncounterTokens}
        onTokenUpdate={handleTokenUpdate}
        onTokenDelete={handleTokenDelete}
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
