import { TokenCard } from './TokenCard';

export function TokenList() {
  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-4">
      <TokenCard 
        name="VALERIUS"
        type="PC - PALADIN"
        hp="84/84"
        ac="18"
        speed="30ft"
        size="MED"
        init="+2"
        isEnemy={false}
      />
      <TokenCard 
        name="GOBLIN SCOUT"
        type="NPC - HOSTILE"
        hp="12/15"
        ac="13"
        speed="30ft"
        size="SML"
        init="+4"
        isEnemy={true}
      />
    </div>
  );
}
