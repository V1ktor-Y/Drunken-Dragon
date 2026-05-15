import { useState } from "react";
import { TokenCard } from "./TokenCard";
import type { SidebarToken } from "../../types/tokens";

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
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
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
}

export function TokenList({ selectedTokenId, selectedTokenVersion, onTokenUpdate }: TokenListProps) {
  const [isLoggedIn] = useState(() => Boolean(getAuthToken()));
  const [tokens, setTokens] = useState<SidebarToken[]>(() =>
    getStoredTokens() ?? (getAuthToken() ? mockTokens : []),
  );

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
