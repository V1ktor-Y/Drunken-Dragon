import accountIcon from "../../assets/account.svg";
import diceIcon from "../../assets/dice.svg";
import encounterIcon from "../../assets/encounter.svg";
import mapIcon from "../../assets/map.svg";
import notesIcon from "../../assets/notes.svg";
import tokensIcon from "../../assets/tokens.svg";

const tabs = [
  { label: "Tokens", icon: tokensIcon },
  { label: "Dice", icon: diceIcon },
  { label: "Encounter", icon: encounterIcon },
  { label: "Map", icon: mapIcon },
  { label: "Notes", icon: notesIcon },
  { label: "Account", icon: accountIcon },
];

export function SidebarTabs() {
  return (
    <nav className="sidebar-tabs" aria-label="Sidebar sections">
      {tabs.map((tab, index) => (
        <button
          className={`sidebar-tab ${index === 0 ? "sidebar-tab-active" : ""}`}
          key={tab.label}
          type="button"
          aria-label={tab.label}
        >
          <img className="tab-icon" src={tab.icon} alt="" aria-hidden="true" />
        </button>
      ))}
    </nav>
  );
}
