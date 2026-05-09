export function SidebarTabs() {
  return (
    <div className="grid grid-cols-3 border-b border-[#333338]">
      <button className="flex flex-col items-center justify-center space-y-1 border-b-2 border-[#00a3ff] bg-[#171c22] p-2 text-[#00a3ff] drop-shadow-[0_0_8px_rgba(0,163,255,0.4)] transition-all hover:bg-[#30353b]">
        <span className="material-symbols-outlined text-[18px]">token</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">TOKENS</span>
      </button>
      <button className="flex flex-col items-center justify-center space-y-1 border-b border-l border-r border-[#333338] border-b-transparent p-2 text-[#bec7d4] transition-all hover:bg-[#30353b] hover:text-[#dfe3ea]">
        <span className="material-symbols-outlined text-[18px]">casino</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">DICE</span>
      </button>
      <button className="flex flex-col items-center justify-center space-y-1 border-b border-transparent p-2 text-[#bec7d4] transition-all hover:bg-[#30353b] hover:text-[#dfe3ea]">
        <span className="material-symbols-outlined text-[18px]">swords</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">ENCOUNTER</span>
      </button>
      <button className="flex flex-col items-center justify-center space-y-1 border-b border-t border-[#333338] border-b-transparent p-2 text-[#bec7d4] transition-all hover:bg-[#30353b] hover:text-[#dfe3ea]">
        <span className="material-symbols-outlined text-[18px]">map</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">MAP</span>
      </button>
      <button className="flex flex-col items-center justify-center space-y-1 border-b border-l border-r border-t border-[#333338] border-b-transparent p-2 text-[#bec7d4] transition-all hover:bg-[#30353b] hover:text-[#dfe3ea]">
        <span className="material-symbols-outlined text-[18px]">description</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">NOTES</span>
      </button>
      <button className="flex flex-col items-center justify-center space-y-1 border-b border-t border-[#333338] border-b-transparent p-2 text-[#bec7d4] transition-all hover:bg-[#30353b] hover:text-[#dfe3ea]">
        <span className="material-symbols-outlined text-[18px]">account_circle</span>
        <span className="font-label-mono-sm uppercase text-label-mono-sm">ACCOUNT</span>
      </button>
    </div>
  );
}
