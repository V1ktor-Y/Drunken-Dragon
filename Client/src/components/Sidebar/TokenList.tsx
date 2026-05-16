import { useEffect, useRef, useState } from "react";
import { TokenCard } from "./TokenCard";
import type { SidebarToken, TokenCloneCreatedDetail } from "../../types/tokens";
import { getTokenImage } from "../../utils/indexedDB";

const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";
const TOKEN_STORAGE_KEY = "drunkenDragon.tokens";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

function getStoredTokens() {
  const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!storedTokens) return null;

  try {
    return JSON.parse(storedTokens) as SidebarToken[];
  } catch {
    return null;
  }
}

function saveStoredTokens(tokens: SidebarToken[]) {
  try {
    // Strip all heavy image data from localStorage to prevent QuotaExceededError. 
    // The actual massive images live purely in memory or IndexedDB.
    const compressTokens = tokens.map((t) => ({ ...t, imageSource: undefined }));
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(compressTokens));
  } catch (error) {
    console.error("Storage error processing tokens:", error);
  }
}

const mockTokens = [
  {
    id: "mock-valerius",
    name: "VALERIUS",
    type: "PC - PALADIN",
    hp: "84/84",
    ac: "18",
    speed: "30ft",
    size: "MED",
    init: "+2",
    isEnemy: false,
  },
  {
    id: "mock-goblin-scout",
    name: "GOBLIN SCOUT",
    type: "NPC - HOSTILE",
    hp: "12/15",
    ac: "13",
    speed: "30ft",
    size: "SML",
    init: "+4",
    isEnemy: true,
  },
];

interface TokenListProps {
  selectedTokenId: string | null;
  selectedTokenVersion: number;
  onTokenUpdate: (token: SidebarToken) => void;
  onTokenDelete: (tokenId: string) => void;
}

export function TokenList({
  selectedTokenId,
  selectedTokenVersion,
  onTokenUpdate,
  onTokenDelete,
}: TokenListProps) {
  const [isLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [tokens, setTokens] = useState<SidebarToken[]>(() =>
    getStoredTokens() ?? (getAuthToken() ? mockTokens : []),
  );
  const lastCloneRef = useRef<{ key: string; timestamp: number } | null>(null);

  // Re-hydrate images from IndexedDB safely on mount
  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      // Capture the tokens we need to hydrate
      const tokensToHydrate = getStoredTokens() ?? (getAuthToken() ? mockTokens : []);
      
      const updatedTokens = await Promise.all(
        tokensToHydrate.map(async (token) => {
          const fetchId = token.sourceTokenId ?? token.id;
          const imageSource = await getTokenImage(fetchId);
          return imageSource ? { ...token, imageSource } : token;
        })
      );
      
      if (mounted && updatedTokens.some((t, i) => t.imageSource !== tokensToHydrate[i].imageSource)) {
        setTokens((currentTokens) => 
          currentTokens.map((ct) => {
            const hydrated = updatedTokens.find((ut) => ut.id === ct.id);
            return hydrated && hydrated.imageSource ? { ...ct, imageSource: hydrated.imageSource } : ct;
          })
        );
      }
    }
    
    loadImages();

    return () => { mounted = false; };
  }, []); // Run exactly once on mount

  useEffect(() => {
    const handleTokenCloned = (event: Event) => {
      const { token } = (event as CustomEvent<TokenCloneCreatedDetail>).detail;
      const cloneKey = `${token.sourceTokenId ?? token.id}:${token.name}`;
      const now = Date.now();
      const lastClone = lastCloneRef.current;

      if (lastClone && lastClone.key === cloneKey && now - lastClone.timestamp < 150) {
        return;
      }

      lastCloneRef.current = { key: cloneKey, timestamp: now };

      setTokens((currentTokens) => {
        if (currentTokens.some((currentToken) => currentToken.id === token.id)) {
          return currentTokens;
        }

        const nextTokens = [token, ...currentTokens];
        saveStoredTokens(nextTokens);
        return nextTokens;
      });
    };

    window.addEventListener("drunken-dragon-token-cloned", handleTokenCloned);
    return () => window.removeEventListener("drunken-dragon-token-cloned", handleTokenCloned);
  }, []);

  const handleAddToken = () => {
    const newToken = {
      id: `token-${Date.now()}-${crypto.randomUUID()}`,
      name: "NEW TOKEN",
      type: "CUSTOM",
      hp: "10/10",
      ac: "10",
      speed: "30ft",
      size: "MED",
      init: "+0",
      isEnemy: false,
    };
    const nextTokens = [newToken, ...tokens];
    setTokens(nextTokens);
    saveStoredTokens(nextTokens);
  };

  const handleTokenUpdate = (updatedToken: SidebarToken) => {
    const nextTokens = tokens.map((token) =>
      token.id === updatedToken.id ? updatedToken : token,
    );
    setTokens(nextTokens);
    saveStoredTokens(nextTokens);
    onTokenUpdate(updatedToken);
  };

  const handleTokenDelete = (tokenId: string) => {
    const nextTokens = tokens.filter((token) => token.id !== tokenId);
    setTokens(nextTokens);
    saveStoredTokens(nextTokens);
    onTokenDelete(tokenId);
  };

  return (
    <div className="token-list">
      <h2 className="tokens-title">Tokens</h2>
      <div className="token-list-scrollable">
        {tokens.map((token, index) => (
          <TokenCard
            key={`${token.id}-${index}`}
            {...token}
            selectedTokenId={selectedTokenId}
            selectedTokenVersion={selectedTokenVersion}
            onTokenUpdate={handleTokenUpdate}
            onTokenDelete={handleTokenDelete}
          />
        ))}
      </div>
      <div style={{ padding: "0 32px 14px", display: "flex", flexDirection: "column", gap: "14px" }}>
        <button 
          type="button" 
          className="command-button"
          onClick={handleAddToken}
        >
          + Add Token
        </button>
        {!isLoggedIn && (
          <p className="notes-status" style={{ margin: 0, textTransform: "uppercase", textAlign: "center" }}>
            Log in to load and save tokens.
          </p>
        )}
      </div>
    </div>
  );
}
