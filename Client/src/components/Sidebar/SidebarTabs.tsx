const tabs = ["Tokens", "Dice", "Encounter", "Map", "Notes", "Account"];

export function SidebarTabs() {
  return (
    <nav className="sidebar-tabs" aria-label="Sidebar sections">
      {tabs.map((tab, index) => (
        <button
          className={`sidebar-tab ${index === 0 ? "sidebar-tab-active" : ""}`}
          key={tab}
          type="button"
        >
          <span className="tab-icon" aria-hidden="true">
            {tab.slice(0, 1)}
          </span>
          <span>{tab}</span>
        </button>
      ))}
    </nav>
  );
}
