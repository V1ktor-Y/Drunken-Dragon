import { useMemo, useState } from "react";

const STANDARD_DICE = [4, 6, 8, 12, 20, 100];
const MAX_HISTORY = 6;

type RollEntry = {
  id: number;
  die: number;
  quantity: number;
  modifier: number;
  rolls: number[];
  total: number;
};

function rollDie(sides: number) {
  return Math.floor(Math.random() * sides) + 1;
}

function getRollLabel(quantity: number, die: number, modifier: number) {
  const modifierLabel =
    modifier === 0 ? "" : modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`;

  return `${quantity}D${die}${modifierLabel}`;
}

export function DicePanel() {
  const [selectedDie, setSelectedDie] = useState(20);
  const [customDie, setCustomDie] = useState(128);
  const [quantity, setQuantity] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [history, setHistory] = useState<RollEntry[]>([]);

  const latestRoll = history[0] ?? null;
  const rollLabel = useMemo(
    () => getRollLabel(quantity, selectedDie, modifier),
    [modifier, quantity, selectedDie],
  );

  const handleSelectDie = (die: number) => {
    setSelectedDie(die);
  };

  const handleSelectCustomDie = () => {
    setSelectedDie(Math.max(1, customDie));
  };

  const handleRoll = () => {
    const safeDie = Math.max(1, selectedDie);
    const safeQuantity = Math.max(1, Math.min(quantity, 20));
    const rolls = Array.from({ length: safeQuantity }, () => rollDie(safeDie));
    const total = rolls.reduce((sum, roll) => sum + roll, modifier);

    setHistory((currentHistory) => [
      {
        id: Date.now(),
        die: safeDie,
        quantity: safeQuantity,
        modifier,
        rolls,
        total,
      },
      ...currentHistory.slice(0, MAX_HISTORY - 1),
    ]);
  };

  return (
    <section className="dice-panel" aria-label="Dice roller">
      <h2>Dice Roller</h2>
      <div className="dice-card">
        <div className="dice-grid" aria-label="Standard dice">
          {STANDARD_DICE.map((die) => (
            <button
              className={`dice-choice ${selectedDie === die ? "dice-choice-selected" : ""}`}
              key={die}
              type="button"
              onClick={() => handleSelectDie(die)}
              aria-pressed={selectedDie === die}
            >
              D{die}
            </button>
          ))}
        </div>

        <label className="dice-field dice-field-custom">
          <span>Custom Dice</span>
          <input
            type="number"
            min="1"
            value={customDie}
            onChange={(event) => {
              const newValue = Math.max(1, Number(event.currentTarget.value));
              setCustomDie(newValue);
              setSelectedDie(newValue);
            }}
            onFocus={handleSelectCustomDie}
          />
        </label>

        <div className="dice-options">
          <label className="dice-field">
            <span>Dice</span>
            <input
              type="number"
              min="1"
              max="20"
              value={quantity}
              onChange={(event) =>
                setQuantity(Math.max(1, Math.min(20, Number(event.currentTarget.value))))
              }
            />
          </label>
          <label className="dice-field">
            <span>Mod</span>
            <input
              type="number"
              value={modifier}
              onChange={(event) => setModifier(Number(event.currentTarget.value))}
            />
          </label>
        </div>

        <button className="dice-roll-button" type="button" onClick={handleRoll}>
          Roll
        </button>

        <div className="dice-result" aria-live="polite">
          <span>Result</span>
          <strong>{latestRoll ? latestRoll.total : "-"}</strong>
          <p>{latestRoll ? getRollLabel(latestRoll.quantity, latestRoll.die, latestRoll.modifier) : rollLabel}</p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="dice-history">
          <h3>History</h3>
          <ol>
            {history.map((entry) => (
              <li key={entry.id}>
                <strong>{entry.total}</strong>
                <span>{getRollLabel(entry.quantity, entry.die, entry.modifier)}</span>
                <small>{entry.rolls.join(", ")}</small>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
}
