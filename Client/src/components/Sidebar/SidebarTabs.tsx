import accountIcon from "../../assets/account.svg";
import diceIcon from "../../assets/dice.svg";
import encounterIcon from "../../assets/encounter.svg";
import mapIcon from "../../assets/map.svg";
import notesIcon from "../../assets/notes.svg";
import tokensIcon from "../../assets/tokens.svg";

export type SidebarTab = "Tokens" | "Dice" | "Encounter" | "Map" | "Notes" | "Account";

const tabs: { label: SidebarTab; icon: string }[] = [
  { label: "Tokens", icon: tokensIcon },
  { label: "Dice", icon: diceIcon },
  { label: "Encounter", icon: encounterIcon },
  { label: "Map", icon: mapIcon },
  { label: "Notes", icon: notesIcon },
  { label: "Account", icon: accountIcon },
];

interface SidebarTabsProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
}

export function SidebarTabs({ activeTab, onTabChange }: SidebarTabsProps) {
  return (
    <nav className="sidebar-tabs" aria-label="Sidebar sections" role="tablist">
      {tabs.map((tab) => (
        <button
          className={`sidebar-tab ${tab.label === activeTab ? "sidebar-tab-active" : ""}`}
          key={tab.label}
          type="button"
          role="tab"
          aria-label={tab.label}
          aria-selected={tab.label === activeTab}
          onClick={() => onTabChange(tab.label)}
        >
          <img className="tab-icon" src={tab.icon} alt="" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
