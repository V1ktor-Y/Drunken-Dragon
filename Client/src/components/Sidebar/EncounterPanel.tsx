import { useEffect, useState } from "react";
import type { PlacedToken } from "../../types/tokens";

interface EncounterPanelProps {
  placedTokens: PlacedToken[];
  encounterTokens: PlacedToken[];
  activeTokenInstanceId: string | null;
  onEncounterTokensChange: (tokens: PlacedToken[]) => void;
}

function getInitiativeValue(init: string) {
  const parsedInit = Number.parseInt(init.replace("+", ""), 10);
  return Number.isFinite(parsedInit) ? parsedInit : 0;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

function getSortedEncounterTokens(tokens: PlacedToken[]) {
  return [...tokens].sort((firstToken, secondToken) => {
    const initDifference =
      getInitiativeValue(secondToken.init) - getInitiativeValue(firstToken.init);

    if (initDifference !== 0) return initDifference;
    return firstToken.name.localeCompare(secondToken.name);
  });
}

export function EncounterPanel({
  placedTokens,
  encounterTokens,
  activeTokenInstanceId,
  onEncounterTokensChange,
}: EncounterPanelProps) {
  const [draftInitiatives, setDraftInitiatives] = useState<Record<string, string>>({});
  const isEncounterActive = encounterTokens.length > 0;

  useEffect(() => {
    setDraftInitiatives((current) => {
      const next = { ...current };
      placedTokens.forEach((token) => {
        if (next[token.instanceId] === undefined) {
          next[token.instanceId] = token.init;
        }
      });
      return next;
    });
  }, [placedTokens]);

  const displayTokens = placedTokens.map((token) => ({
    ...token,
    init: draftInitiatives[token.instanceId] ?? token.init,
  }));

  const handleInitiativeChange = (instanceId: string, init: string) => {
    setDraftInitiatives((current) => ({ ...current, [instanceId]: init }));

    if (!isEncounterActive) return;
    onEncounterTokensChange(
      encounterTokens.map((token) =>
        token.instanceId === instanceId ? { ...token, init } : token,
      ),
    );
  };

  const handleStartEncounter = () => {
    const seededTokens = placedTokens.map((token) => ({
      ...token,
      init: draftInitiatives[token.instanceId] ?? token.init,
    }));
    onEncounterTokensChange(getSortedEncounterTokens(seededTokens));
  };

  const handleEndEncounter = () => {
    onEncounterTokensChange([]);
  };

  return (
    <div className="encounter-panel token-list">
      <h2 className="tokens-title">Encounter</h2>
      <div className="token-list-scrollable">
        {displayTokens.map((token, index) => (
          <article
            key={token.instanceId}
            className={`encounter-card token-card ${
              token.instanceId === activeTokenInstanceId ? "encounter-card-active" : ""
            }`}
          >
            <div className="token-card-main" style={{ alignItems: "center" }}>
              <div
                className="token-card-avatar encounter-avatar"
                style={{
                  borderColor: index === 0 ? "var(--primary)" : undefined,
                  backgroundImage: token.imageSource ? `url(${token.imageSource})` : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {!token.imageSource && getInitials(token.name)}
              </div>
              <div className="token-card-info">
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{token.name}</h3>
                <label className="token-detail-field encounter-init-field">
                  <span>Initiative:</span>
                  <input
                    type="number"
                    value={token.init}
                    onChange={(event) =>
                      handleInitiativeChange(token.instanceId, event.currentTarget.value)
                    }
                  />
                </label>
              </div>
            </div>
          </article>
        ))}
        {placedTokens.length === 0 && (
          <p className="notes-status" style={{ textAlign: "center", textTransform: "uppercase" }}>
            Place tokens on the map to begin an encounter.
          </p>
        )}
      </div>
      <div className="encounter-actions">
        <button
          type="button"
          className="command-button encounter-action-btn"
          onClick={handleStartEncounter}
          disabled={placedTokens.length === 0 || isEncounterActive}
        >
          Start Encounter
        </button>
        <button
          type="button"
          className="command-button encounter-action-btn"
          onClick={handleEndEncounter}
          disabled={!isEncounterActive}
        >
          End Encounter
        </button>
      </div>
    </div>
  );
}
