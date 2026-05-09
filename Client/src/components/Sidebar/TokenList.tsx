import { TokenCard } from "./TokenCard";

const tokens = [
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
  return (
    <div className="token-list">
      {tokens.map((token) => (
        <TokenCard key={token.name} {...token} />
      ))}
    </div>
  );
}
