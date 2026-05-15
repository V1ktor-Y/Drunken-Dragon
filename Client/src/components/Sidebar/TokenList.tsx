import { useState, useEffect } from "react";
import { TokenCard } from "./TokenCard";

const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

const mockTokens = [
  {
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

export function TokenList() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tokens, setTokens] = useState<typeof mockTokens>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      // TODO: Load tokens from backend. Using mock tokens for now.
      setTokens(mockTokens);
    } else {
      setIsLoggedIn(false);
      setTokens([]); // Start empty when not logged in
    }
  }, []);

  const handleAddToken = () => {
    const newToken = {
      name: "NEW TOKEN",
      type: "CUSTOM",
      hp: "10/10",
      ac: "10",
      speed: "30ft",
      size: "MED",
      init: "+0",
      isEnemy: false,
    };
    setTokens([newToken, ...tokens]);
  };

  return (
    <div className="token-list">
      <h2 className="tokens-title">Tokens</h2>
      <div className="token-list-scrollable">
        {tokens.map((token, index) => (
          <TokenCard key={`${token.name}-${index}`} {...token} />
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
