import type { PlacedToken } from "../../types/tokens";

interface TurnTrackerProps {
  activeTokenInstanceId: string | null;
  placedTokens: PlacedToken[];
  onActiveTokenChange: (tokenInstanceId: string | null) => void;
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

function getSortedTurns(tokens: PlacedToken[]) {
  return [...tokens].sort((firstToken, secondToken) => {
    const initDifference =
      getInitiativeValue(secondToken.init) - getInitiativeValue(firstToken.init);

    if (initDifference !== 0) return initDifference;
    return firstToken.name.localeCompare(secondToken.name);
  });
}

export function TurnTracker({
  activeTokenInstanceId,
  placedTokens,
  onActiveTokenChange,
}: TurnTrackerProps) {
  const turns = getSortedTurns(placedTokens);
  const activeIndex = turns.findIndex(
    (turn) => turn.instanceId === activeTokenInstanceId,
  );

  const handleStartTurns = () => {
    onActiveTokenChange(turns[0]?.instanceId ?? null);
  };

  const handlePreviousTurn = () => {
    if (turns.length === 0) return;
    const currentIndex = activeIndex === -1 ? 0 : activeIndex;
    const previousIndex = (currentIndex - 1 + turns.length) % turns.length;
    onActiveTokenChange(turns[previousIndex].instanceId);
  };

  const handleNextTurn = () => {
    if (turns.length === 0) return;
    const currentIndex = activeIndex === -1 ? -1 : activeIndex;
    const nextIndex = (currentIndex + 1) % turns.length;
    onActiveTokenChange(turns[nextIndex].instanceId);
  };

  return (
    <section className="turn-tracker" aria-label="Turn tracker">
      <div className="turn-list">
        {turns.map((turn) => {
          const isActive = turn.instanceId === activeTokenInstanceId;

          return (
          <div
            key={turn.instanceId}
            className={`turn-chip ${
              turn.isEnemy ? "turn-chip-enemy" : "turn-chip-ally"
            } ${
              isActive ? "turn-chip-active" : ""
            }`}
            title={`${turn.name} - initiative ${turn.init}`}
          >
            {turn.imageSource ? (
              <img src={turn.imageSource} alt="" draggable={false} />
            ) : (
              getInitials(turn.name) || "T"
            )}
          </div>
          );
        })}
        {turns.length === 0 && <p className="turn-empty">No encounter tokens</p>}
      </div>
      <div className="turn-divider" />
      {activeTokenInstanceId ? (
        <button className="command-button turn-step-button" type="button" onClick={handlePreviousTurn}>
          Previous
        </button>
      ) : (
        <button
          className="command-button turn-step-button"
          type="button"
          onClick={handleStartTurns}
          disabled={turns.length === 0}
        >
          Start
        </button>
      )}
      <button
        className="command-button turn-step-button"
        type="button"
        onClick={handleNextTurn}
        disabled={turns.length === 0}
      >
        Next
      </button>
    </section>
  );
}
