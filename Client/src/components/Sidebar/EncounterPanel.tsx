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

  const handleRollSingle = (instanceId: string) => {
    const baseToken = placedTokens.find((t) => t.instanceId === instanceId);
    if (!baseToken) return;

    const roll = Math.floor(Math.random() * 20) + 1;
    const modifier = getInitiativeValue(baseToken.init);
    const total = roll + modifier;
    handleInitiativeChange(instanceId, total.toString());
  };

  const handleRollAll = () => {
    const newDrafts = { ...draftInitiatives };

    placedTokens.forEach((token) => {
      const roll = Math.floor(Math.random() * 20) + 1;
      const modifier = getInitiativeValue(token.init);
      newDrafts[token.instanceId] = (roll + modifier).toString();
    });

    setDraftInitiatives(newDrafts);

    if (isEncounterActive) {
      onEncounterTokensChange(
        encounterTokens.map((token) => ({
          ...token,
          init: newDrafts[token.instanceId] ?? token.init,
        }))
      );
    }
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
              />
              <div className="token-card-info">
                <h3 style={{ fontSize: "16px", marginBottom: "4px" }}>{token.name}</h3>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "8px", flexWrap: "wrap" }}>
                  <label className="token-detail-field encounter-init-field" style={{ marginTop: 0 }}>
                    <span>Init:</span>
                    <input
                      type="number"
                      value={token.init}
                      onChange={(event) =>
                        handleInitiativeChange(token.instanceId, event.currentTarget.value)
                      }
                    />
                  </label>
                  <button
                    type="button"
                    className="command-button"
                    style={{ padding: "4px 8px", fontSize: "12px", minWidth: "48px", marginLeft: "auto" }}
                    onClick={() => handleRollSingle(token.instanceId)}
                  >
                    Roll
                  </button>
                </div>
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
          onClick={handleRollAll}
          disabled={placedTokens.length === 0}
        >
          Roll All
        </button>
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
