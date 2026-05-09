import { SidebarHeader } from './SidebarHeader';
import { SidebarTabs } from './SidebarTabs';
import { TokenList } from './TokenList';

export function Sidebar() {
  return (
    <aside className="z-40 flex h-screen w-sidebar_width shrink-0 flex-col border-l border-[#333338] bg-[#131316]">
      <SidebarHeader />
      <SidebarTabs />
      <TokenList />

      {/* CTA Footer */}
      <div className="border-t border-[#333338] bg-[#131316] p-4">
        <button className="flex w-full items-center justify-center space-x-2 border border-[#fcfcfc] bg-transparent py-3 font-label-mono uppercase text-label-mono text-white transition-all hover:bg-[#fcfcfc] hover:text-[#0e0e11] active:scale-95">
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>NEW ENCOUNTER</span>
        </button>
      </div>
    </aside>
  );
}
