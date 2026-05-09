export function TurnTracker() {
  return (
    <div className="absolute left-1/2 top-6 z-50 flex -translate-x-1/2 transform items-center space-x-4 border border-[#333338] bg-[#131316] p-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <div className="flex items-center space-x-2 px-2">
        <div className="flex h-10 w-10 items-center justify-center border border-[#fcfcfc] bg-[#171c22] opacity-40 font-label-mono-sm text-label-mono-sm text-white">
          PC
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[#ffb4ab] bg-[#171c22] opacity-40 font-label-mono-sm text-label-mono-sm text-[#ffb4ab]">
          E1
        </div>
        {/* Active Turn */}
        <div className="flex h-10 w-10 scale-110 items-center justify-center border border-[#00a3ff] bg-[#171c22] font-label-mono-sm text-label-mono-sm text-[#00a3ff] drop-shadow-[0_0_8px_rgba(0,163,255,0.6)]">
          PC
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[#ffb4ab] bg-[#171c22] font-label-mono-sm text-label-mono-sm text-[#ffb4ab]">
          E2
        </div>
        <div className="flex h-10 w-10 items-center justify-center border border-[#fcfcfc] bg-[#171c22] font-label-mono-sm text-label-mono-sm text-white">
          PC
        </div>
      </div>
      <div className="mx-2 h-10 border-l border-[#333338]"></div>
      <button className="border border-[#fcfcfc] bg-transparent px-4 py-2 font-label-mono uppercase text-label-mono text-white transition-all hover:bg-[#fcfcfc] hover:text-[#0e0e11] active:scale-95">
        NEXT TURN
      </button>
      <div className="flex space-x-1 border-l border-[#333338] pl-2 pr-1">
        <button className="border border-transparent p-1 transition-colors hover:border-[#131316] hover:bg-[#fcfcfc] hover:text-[#131316]">
          <span className="material-symbols-outlined text-[18px]">settings</span>
        </button>
        <button className="border border-transparent p-1 transition-colors hover:border-[#131316] hover:bg-[#fcfcfc] hover:text-[#131316]">
          <span className="material-symbols-outlined text-[18px]">help</span>
        </button>
      </div>
    </div>
  );
}
