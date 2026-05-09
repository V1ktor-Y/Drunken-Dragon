import { SidebarHeader } from "./SidebarHeader";
import { SidebarTabs } from "./SidebarTabs";
import { TokenList } from "./TokenList";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <SidebarTabs />
      <TokenList />
      <div className="sidebar-footer">
        <button className="command-button sidebar-action" type="button">
          + New Encounter
        </button>
      </div>
    </aside>
  );
}
