import { Stage } from "./components/Stage/Stage";
import { Sidebar } from "./components/Sidebar/Sidebar";

function App() {
  return (
    <div className="app-shell">
      <Stage />
      <Sidebar />
    </div>
  );
}

export default App;
