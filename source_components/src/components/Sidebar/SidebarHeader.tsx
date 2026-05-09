export function SidebarHeader() {
  return (
    <div className="flex items-center space-x-4 border-b border-[#333338] p-4">
      <div className="flex h-12 w-12 items-center justify-center overflow-hidden border border-[#fcfcfc] bg-surface-container">
        <span className="material-symbols-outlined text-[24px] text-[#fcfcfc]">
          person
        </span>
      </div>
      <div>
        <h2 className="font-headline-sm text-headline-sm text-[#fcfcfc]">
          VALERIUS
        </h2>
        <p className="font-label-mono-sm uppercase text-label-mono-sm text-[#88919d]">
          LEVEL 14 PALADIN
        </p>
      </div>
    </div>
  );
}
