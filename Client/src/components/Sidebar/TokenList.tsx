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
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [tokens, setTokens] = useState<SidebarToken[]>(() =>
    getStoredTokens() ?? [],
  );
  const lastCloneRef = useRef<{ key: string; timestamp: number } | null>(null);

  useEffect(() => {
    const handleAuthChanged = () => {
      setIsLoggedIn(Boolean(getAuthToken()));
    };
    window.addEventListener("drunkenDragon:authChanged", handleAuthChanged);
    return () => window.removeEventListener("drunkenDragon:authChanged", handleAuthChanged);
  }, []);

  // Re-hydrate images from IndexedDB safely on mount
  useEffect(() => {
    let mounted = true;

    async function loadData() {
      // 1. Rehydrate images from IndexedDB
      const tokensToHydrate = getStoredTokens() ?? [];
      
      let currentTokens = await Promise.all(
        tokensToHydrate.map(async (token) => {
          const fetchId = token.sourceTokenId ?? token.id;
          const imageSource = await getTokenImage(fetchId);
          return imageSource ? { ...token, imageSource } : token;
        })
      );

      // 2. Fetch backend tokens if logged in
      const token = getAuthToken();
      if (token) {
        try {
          const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
          const res = await fetch(`${API_BASE_URL}/api/CToken`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (res.ok) {
            const data = await res.json() as any[];
            const backendTokens: SidebarToken[] = data.map(dto => ({
              id: dto.id.toString(),
              name: dto.name,
              type: dto.class || "CUSTOM",
              hp: `${dto.maxHp}/${dto.maxHp}`,
              ac: dto.armorClass.toString(),
              speed: `${dto.speed}ft`,
              size: "MED",
              init: "+0",
              isEnemy: false,
              imageSource: dto.icon && dto.icon !== "/uploads/icons/default.png" 
                ? `${API_BASE_URL}${dto.icon}` 
                : undefined
            }));

            // Merge backend tokens into currentTokens (replacing local ones with the same ID, or adding new ones)
            const backendIds = new Set(backendTokens.map(t => t.id));
            const mergedTokens = [
              ...backendTokens,
              ...currentTokens.filter(t => !backendIds.has(t.id))
            ];
            currentTokens = mergedTokens;
          }
        } catch (err) {
          console.error("Failed to load backend tokens", err);
        }
      }
      
      if (mounted) {
        setTokens(currentTokens);
        saveStoredTokens(currentTokens);
      }
    }
    
    loadData();

    return () => { mounted = false; };
  }, [isLoggedIn]); // Run on mount and when login state changes

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

  const handleTokenUpdate = async (updatedToken: SidebarToken) => {
    // Optimistic update locally
    let nextTokens = tokens.map((token) =>
      token.id === updatedToken.id ? updatedToken : token,
    );
    setTokens(nextTokens);
    saveStoredTokens(nextTokens);
    onTokenUpdate(updatedToken);

    // Sync to backend if logged in
    const authToken = getAuthToken();
    // Only upload original templates, not placed copies
    if (authToken && !updatedToken.sourceTokenId) {
      try {
        const formData = new FormData();
        formData.append("Name", updatedToken.name);
        formData.append("Class", updatedToken.type);
        
        const [currentHp, maxHpStr] = updatedToken.hp.split("/");
        formData.append("MaxHp", (parseInt(maxHpStr || currentHp, 10) || 1).toString());
        formData.append("Speed", (parseInt(updatedToken.speed.replace("ft", ""), 10) || 30).toString());
        formData.append("ArmorClass", (parseInt(updatedToken.ac, 10) || 10).toString());

        if (updatedToken.imageSource && updatedToken.imageSource.startsWith("data:")) {
           const res = await fetch(updatedToken.imageSource);
           const blob = await res.blob();
           formData.append("Icon", blob, "icon.jpg");
        }

        const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
        const isLocal = updatedToken.id.startsWith("token-");
        const method = isLocal ? "POST" : "PUT";
        const url = isLocal 
           ? `${API_BASE_URL}/api/CToken` 
           : `${API_BASE_URL}/api/CToken/${updatedToken.id}`;

        const response = await fetch(url, {
           method,
           headers: { Authorization: `Bearer ${authToken}` },
           body: formData
        });

        if (response.ok) {
           if (isLocal) {
             const data = await response.json() as any; // CharacterTokenGetDto
             const finalToken = { 
               ...updatedToken, 
               id: data.id.toString(),
               imageSource: data.icon && data.icon !== "/uploads/icons/default.png" 
                  ? `${API_BASE_URL}${data.icon}` 
                  : updatedToken.imageSource
             };
             
             nextTokens = nextTokens.map((token) =>
                token.id === updatedToken.id ? finalToken : token,
             );
             setTokens(nextTokens);
             saveStoredTokens(nextTokens);
             
             // Tell App.tsx to update the placed copies with the new parent ID if it cares,
             // but mostly this just switches the sidebar token's ID so future saves use PUT.
             onTokenUpdate(finalToken);
           }
        }
      } catch (err) {
         console.error("Failed to sync token to backend", err);
      }
    }
  };

  const handleTokenDelete = async (tokenId: string) => {
    // Delete optimistically
    const nextTokens = tokens.filter((token) => token.id !== tokenId);
    setTokens(nextTokens);
    saveStoredTokens(nextTokens);
    onTokenDelete(tokenId);

    const authToken = getAuthToken();
    if (authToken && !tokenId.startsWith("token-") && !tokenId.startsWith("token-copy-")) {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5195";
        await fetch(`${API_BASE_URL}/api/CToken/${tokenId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${authToken}` }
        });
      } catch (err) {
        console.error("Failed to delete token from backend", err);
      }
    }
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
