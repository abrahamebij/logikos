import "./App.css";
import ExternalDisplay from "./components/layout/ExternalDisplay";
import Interface from "./pages/Interface";

function App() {
  const isExternalDisplay =
    new URLSearchParams(window.location.search).get("display") === "external";

  return isExternalDisplay ? <ExternalDisplay /> : <Interface />;
}

export default App;
