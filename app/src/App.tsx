import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { AppFooter, AppHeader } from "./components";
import { ContextProvider } from "./context";
import DApp from "./DApp";

function App() {
  return (
    <ContextProvider>
      <div className="app-container">
        <AppHeader />
        <DApp />
        <AppFooter />
      </div>
    </ContextProvider>
  );
}

export default App;
