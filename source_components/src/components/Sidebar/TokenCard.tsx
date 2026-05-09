export function TokenCard({
  name,
  type,
  hp,
  ac,
  speed,
  size,
  init,
  isEnemy
}: {
  name: string;
  type: string;
  hp: string;
  ac: string;
  speed: string;
  size: string;
  init: string;
  isEnemy: boolean;
}) {
  return (
    <div className={`relative flex flex-col border p-3 ${isEnemy ? 'border-[#333338] bg-[#131316] opacity-80 transition-opacity hover:opacity-100' : 'border-[#fcfcfc] bg-[#131316]'}`}>
      <div className="mb-2 flex items-start justify-between border-b border-[#333338] pb-2">
        <div>
          <span className={`font-headline-sm block text-body-lg ${isEnemy ? 'text-[#bec7d4]' : ''}`}>
            {name}
          </span>
          <span className="font-label-mono-sm text-label-mono-sm text-[#88919d]">
            {type}
          </span>
        </div>
        <div className="text-right">
          <span className={`font-label-mono text-label-mono ${isEnemy ? 'text-[#ffb4ab]' : 'text-[#00a3ff] drop-shadow-[0_0_4px_rgba(0,163,255,0.4)]'}`}>
            HP {hp}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-label-mono-sm text-label-mono-sm">
        <div className="flex justify-between border-b border-[#333338] py-1">
          <span className="text-[#88919d]">AC</span>
          <span className={isEnemy ? 'text-[#bec7d4]' : ''}>{ac}</span>
        </div>
        <div className="flex justify-between border-b border-[#333338] py-1">
          <span className="text-[#88919d]">SPEED</span>
          <span className={isEnemy ? 'text-[#bec7d4]' : ''}>{speed}</span>
        </div>
        <div className="flex justify-between border-b border-[#333338] py-1">
          <span className="text-[#88919d]">SIZE</span>
          <span className={isEnemy ? 'text-[#bec7d4]' : ''}>{size}</span>
        </div>
        <div className="flex justify-between border-b border-[#333338] py-1">
          <span className="text-[#88919d]">INIT</span>
          <span className={isEnemy ? 'text-[#bec7d4]' : ''}>{init}</span>
        </div>
      </div>
    </div>
  );
}
