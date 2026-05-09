export function ZoomSlider() {
  return (
    <div className="absolute left-gutter top-1/2 z-10 flex -translate-y-1/2 transform flex-col items-center space-y-2 border border-[#333338] bg-[#131316] p-1">
      <button className="flex h-6 w-6 items-center justify-center border border-transparent text-[#fcfcfc] hover:bg-[#fcfcfc] hover:text-[#131316]">
        <span className="material-symbols-outlined text-[16px]">add</span>
      </button>
      <div className="relative mx-auto h-24 w-1 bg-[#333338]">
        <div className="absolute left-1/2 top-1/3 h-1 w-3 -translate-x-1/2 transform cursor-pointer bg-[#fcfcfc]"></div>
      </div>
      <button className="flex h-6 w-6 items-center justify-center border border-transparent text-[#fcfcfc] hover:bg-[#fcfcfc] hover:text-[#131316]">
        <span className="material-symbols-outlined text-[16px]">remove</span>
      </button>
    </div>
  );
}
