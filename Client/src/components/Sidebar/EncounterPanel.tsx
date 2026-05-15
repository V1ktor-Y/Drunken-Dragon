import { useState, useEffect } from "react";

const AUTH_TOKEN_STORAGE_KEY = "drunkenDragon.authToken";

function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

// Temporary mock tokens from backend
const mockTokens = [
  { name: "VALERIUS", init: "13" },
  { name: "GOBLIN SCOUT", init: "15" },
];

export function EncounterPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [encounterTokens, setEncounterTokens] = useState<typeof mockTokens>([]);
  const [availableTokens, setAvailableTokens] = useState<typeof mockTokens>([]);
  const [selectedToken, setSelectedToken] = useState("");

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setIsLoggedIn(true);
      // TODO: Load from backend
      setAvailableTokens(mockTokens);
      setEncounterTokens(mockTokens);
    } else {
      setIsLoggedIn(false);
      setAvailableTokens(mockTokens);
      setEncounterTokens([]);
    }
  }, []);

  const handleAddEncounterToken = () => {
    if (!selectedToken) return;
    const tokenToAdd = availableTokens.find((t) => t.name === selectedToken);
    if (tokenToAdd) {
      setEncounterTokens([...encounterTokens, tokenToAdd]);
      setSelectedToken("");
    }
  };

  const handleRemoveEncounterToken = (indexToRemove: number) => {
    setEncounterTokens(encounterTokens.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="encounter-panel token-list">
      <h2 className="tokens-title">Encounter</h2>
      <div className="token-list-scrollable">
        {encounterTokens.map((token, index) => (
          <article key={`${token.name}-${index}`} className="encounter-card token-card">
            <div className="token-card-main" style={{ alignItems: "center" }}>
              <div className="token-card-avatar encounter-avatar" style={index === 0 ? { borderColor: "var(--primary)" } : {}} />
              <div className="token-card-info">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{token.name}</h3>
                  <button 
                    type="button" 
                    className="encounter-remove-btn"
                    onClick={() => handleRemoveEncounterToken(index)}
                  >
                    X
                  </button>
                </div>
                <div className="token-card-hp" style={{ justifyContent: "flex-start" }}>
                  <span className="hp-label" style={{ fontSize: "12px" }}>Initiative:</span>
                  <div className="hp-bar-container">
                    <span className="hp-text" style={{ fontSize: "14px", minWidth: "auto" }}>{token.init}</span>
                    <div className="hp-bar" style={{ width: "80px" }}>
                      <div className="hp-bar-fill" style={{ width: `${Math.min(100, (parseInt(token.init) / 30) * 100)}%`, background: "var(--text-soft)" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
        {encounterTokens.length === 0 && (
          <p className="notes-status" style={{ textAlign: "center", textTransform: "uppercase" }}>
            The encounter list is empty.
          </p>
        )}
      </div>
      
      <div className="encounter-add-section" style={{ padding: "0 32px 14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <select 
          className="encounter-token-select"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          <option value="" disabled>Select Token...</option>
          {availableTokens.map((t) => (
            <option key={t.name} value={t.name}>{t.name}</option>
          ))}
        </select>
        <button 
          type="button" 
          className="command-button encounter-add-btn"
          disabled={!selectedToken}
          onClick={handleAddEncounterToken}
        >
          Add Token
        </button>
        {!isLoggedIn && (
          <p className="notes-status" style={{ margin: 0, textTransform: "uppercase", textAlign: "center" }}>
            Log in to save encounter.
          </p>
        )}
      </div>
    </div>
  );
}