const turns = [
  { id: "pc-1", label: "PC", tone: "ally", faded: true },
  { id: "enemy-1", label: "E1", tone: "enemy", faded: true },
  { id: "pc-2", label: "PC", tone: "active", faded: false },
  { id: "enemy-2", label: "E2", tone: "enemy", faded: false },
  { id: "pc-3", label: "PC", tone: "ally", faded: false },
];

export function TurnTracker() {
  return (
    <section className="turn-tracker" aria-label="Turn tracker">
      <div className="turn-list">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`turn-chip turn-chip-${turn.tone} ${
              turn.faded ? "turn-chip-faded" : ""
            }`}
          >
            {turn.label}
          </div>
        ))}
      </div>
      <div className="turn-divider" />
      <button className="command-button" type="button">
        Next Turn
      </button>
    </section>
  );
}
